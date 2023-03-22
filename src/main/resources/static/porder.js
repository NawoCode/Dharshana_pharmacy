window.addEventListener("load", initialize);

//Initializing Functions

function initialize() {

    //tooltip enable
    $('[data-toggle="tooltip"]').tooltip()

    // add / clear / update buttons Event Handler
    btnAdd.addEventListener("click", btnAddMC);
    btnClear.addEventListener("click", btnClearMC);
    btnUpdate.addEventListener("click", btnUpdateMC);

    //cmbSupType.addEventListener("change",cmbSupTypeCH);
    //cmbSupName.addEventListener("change",cmbSupNameCH);
    //dteRequireDate.addEventListener("keyup",dateValidationKU('max',));

    cmbQNo.addEventListener("change", cmbQNOCH);

    cmbDrugItem.addEventListener("change", cmbItemDrugCH);
    cmbGroceryItem.addEventListener("change", cmbGroceryItemCH);

    txtDrugQuantity.addEventListener("keyup", txtDrugQuantityCH);
    txtGrceryQuantity.addEventListener("keyup", txtGrceryQuantityCH);

    txtSearchName.addEventListener("keyup", btnSearchMC);

    privilages = httpRequest("../privilage?module=PORDER", "GET");

    qnos = httpRequest("../quotation/list", "GET");
    suppliertypes = httpRequest("../itemtype/list", "GET");
    drugsuppliers = httpRequest("../supplier/drugnamelist", "GET");
    grocerysuppliers = httpRequest("../supplier/grocerynamelist", "GET");
    porderstatuses = httpRequest("../porderstatus/list", "GET");
    employees = httpRequest("../employee/list", "GET");

    //Data list for inner fillcombo box
    items = httpRequest("../item/listgrocery", "GET");
    subitems = httpRequest("../subitem/list", "GET");

    valid = "2px solid green";
    invalid = "2px solid red";
    initial = "2px solid #d6d6c2";
    updated = "2px solid #ff9900";
    active = "#ff9900";

    loadView();
    loadForm();

    changeTab('table');
}

function loadView() {

    //Search Area
    txtSearchName.value = "";
    txtSearchName.style.background = "";

    //Table Area
    activerowno = "";
    activepage = 1;
    var query = "&searchtext=";
    loadTable(1, cmbPageSize.value, query);
}

// for fill data into table
function loadTable(page, size, query) {
    page = page - 1;
    porders = new Array();
    var data = httpRequest("/porder/findAll?page=" + page + "&size=" + size + query, "GET");
    if (data.content != undefined) porders = data.content;
    createPagination('pagination', data.totalPages, data.number + 1, paginate);
    fillTable('tblPorder', porders, fillForm, btnDeleteMC, viewitem);
    clearSelection(tblPorder);

    if (activerowno != "") selectRow(tblPorder, activerowno, active);

}

function paginate(page) {
    var paginate;
    if (olditem == null) {
        paginate = true;
    } else {
        if (getErrors() == '' && getUpdates() == '') {
            paginate = true;
        } else {
            paginate = window.confirm("Form has Some Errors or Update Values. " +
                "Are you sure to discard that changes ?");
        }
    }
    if (paginate) {
        activepage = page;
        activerowno = ""
        loadForm();
        loadSearchedTable();
    }

}

function viewitem(pod, rowno) {

    podview = JSON.parse(JSON.stringify(pod));

    tdpcode.innerHTML = podview.pordercode;
    tdstype.innerHTML = podview.quotation_id.quotationrequest_id.supplier_id.supplytype_id.name;
    tdsname.innerHTML = podview.quotation_id.quotationrequest_id.supplier_id.fullname;
    tdQno.innerHTML = podview.quotation_id.qno;
    tddtRequtDt.innerHTML = podview.requiredate;
    tddtTotlAmount.innerHTML = parseFloat(podview.totalamount).toFixed(2);

    if (podview.quotation_id.quotationrequest_id.supplier_id.supplytype_id.name == "Drug") {
        fillInnerTable("tblPrintInnerDrugItem", podview.porderHasItemsList, innerModify, innerDelete, innerVeiw);
        $('#lblDrug').removeAttr("style");
        $('#tblDrug').removeAttr("style");
        $('#lblGrocery').css("display", "none");
        $('#tblGrocery').css("display", "none");

    } else {
        $('#lblDrug').css("display", "none");
        $('#tblDrug').css("display", "none");
        $('#lblGrocery').removeAttr("style");
        $('#tblGrocery').removeAttr("style");
        fillInnerTable("tblPrintInnerGroceryItem", podview.porderHasItemsList, innerModify, innerDelete, innerVeiw);
    }

    tdasign.innerHTML = podview.employee_id.callingname;
    tdaddate.innerHTML = podview.addeddate;
    tdpstatus.innerHTML = podview.porderstatus_id.name;
    tddesc.innerHTML = podview.description;

    $('#dataVeiwModal').modal('show')


}

function btnPrintRowMC() {

    var format = printformtable.outerHTML;

    var newwindow = window.open();
    newwindow.document.write("<html>" +
        "<head><style type='text/css'>.google-visualization-table-th {text-align: left;}</style>" +
        "<link rel=\'stylesheet\' href=\'resources/bootstrap/css/bootstrap.min.css\'></head>" +
        "<body><div style='margin-top: 150px'><h1 style='text-align: center'>Dharshana Pharmacy & Grocery</h1><h2>Porder Details :</h2></div>" +
        "<div>" + format + "</div>" +
        "<script>printformtable.removeAttribute('style')</script>" +
        "</body></html>");
    setTimeout(function () {
        newwindow.print();
        newwindow.close();
    }, 100);
}

function cmbSupTypeCH() {
    cmbSupType.style.border = valid;
    cmbSupName.disabled = false;
    innerGrocery.style.display = "none";
    innerDrug.style.display = "none";
    //drug
    if (JSON.parse(cmbSupType.value).name == "Drug") {

        fillCombo(cmbSupName, "Select Supplier Name", drugsuppliers, "fullname", "");

        //if supplier type changed
        if (oldporder != null && oldporder.quotation_id.quotationrequest_id.supplier_id.supplytype_id.name != JSON.parse(cmbSupType.value).name) {
            cmbSupType.style.border = updated;
            innerGrocery.style.display = "none";
            innerDrug.style.display = "none";

        } else {
            cmbSupType.style.border = valid;
        }
        cmbSupName.value == "";
        cmbSupName.style.border = initial;
        cmbQNo.style.border = initial;
        cmbQNo.value == "";
        porder.quotation_id = null;
        fillCombo(cmbQNo, "Select QNO", qnos, "qno", "");
        refreshInnerDrug();
        cmbQNo.disabled = true;

        //grocery
    } else {
        fillCombo(cmbSupName, "Select Supplier Name", grocerysuppliers, "fullname", "");

        cmbSupName.style.border = initial;
        //quotation.supplier_id = "";
        cmbSupName.value == "";
        cmbQNo.style.border = initial;
        cmbQNo.value == "";
        porder.quotation_id = "";
        fillCombo(cmbQNo, "Select QNO", qnos, "qno", "");
        refreshInnerGrocery();
        cmbQNo.disabled = true;

    }

}

function cmbSupNameCH() {
    cmbSupName.style.border = valid;
    cmbQNo.disabled = false;
    innerGrocery.style.display = "none";
    innerDrug.style.display = "none";

    //if supplier name changed
    if (oldporder != null && oldporder.quotation_id.quotationrequest_id.supplier_id.fullname != JSON.parse(cmbSupName.value).name) {
        cmbSupName.style.border = updated;
        innerGrocery.style.display = "none";
        innerDrug.style.display = "none";

    } else {
        cmbSupName.style.border = valid;
    }
    cmbQNo.style.border = initial;
    cmbQNo.value == "";
    porder.quotation_id = null;
    qnosbysupplier = httpRequest("../quotation/bySupplier?supplierid=" + JSON.parse(cmbSupName.value).id, "GET");
    fillCombo(cmbQNo, "Select QNO", qnosbysupplier, "qno", "");
}

function subitemsByQNOCH() {
    subitemsbyqnos = httpRequest("../subitem/listbyqno?qnoid=" + JSON.parse(cmbQNo.value).id, "GET");
    fillCombo(cmbDrugItem, "Select Drug Items", subitemsbyqnos, "subitemname", "");
}

function itemsByQNOCH() {
    itemsbyqnos = httpRequest("../item/listbyqno?qnoid=" + JSON.parse(cmbQNo.value).id, "GET");
    fillCombo(cmbGroceryItem, "Select Grocery Items", itemsbyqnos, "itemname", "");
}

function cmbQNOCH() {
    if (JSON.parse(cmbSupType.value).name == "Drug") {
        innerDrug.style.display = "block";
        innerGrocery.style.display = "none";
        refreshInnerDrug();
        subitemsByQNOCH();

    } else {
        innerDrug.style.display = "none";
        innerGrocery.style.display = "block";
        refreshInnerGrocery();
        itemsByQNOCH();

    }
}

function cmbItemDrugCH() {
    quotationsubitems = httpRequest("../quotationhasitem/byquotaionsubitem?quotationid=" + JSON.parse(cmbQNo.value).id + "&subitemid=" + JSON.parse(cmbDrugItem.value).id, "GET");
    txtDrugPurchasePrice.value = parseFloat(quotationsubitems.purchaseprice).toFixed(2);
    porderHasItem.purchaseprice = txtDrugPurchasePrice.value;
    txtDrugQuantity.disabled = false;
}

function cmbGroceryItemCH() {
    quotationitems = httpRequest("../quotationhasitem/byquotaionitem?quotationid=" + JSON.parse(cmbQNo.value).id + "&itemid=" + JSON.parse(cmbGroceryItem.value).id, "GET");
    txtGroceryPurchasPrice.value = parseFloat(quotationitems.purchaseprice).toFixed(2);
    porderHasItem.purchaseprice = txtGroceryPurchasPrice.value;
    txtGrceryQuantity.disabled = false;
}

function txtDrugQuantityCH() {

    var val = txtDrugQuantity.value.trim();
    if (val != "") {
        var regpattern = new RegExp('^[0-9]{1,3}$');
        if (regpattern.test(val)) {
            if (oldporderHasItem != null && oldporderHasItem.qty != txtDrugQuantity.value) {
                txtDrugQuantity.style.border = updated;
                btnInnerDrugUpdate.disabled = false;
                btnInnerDrugAdd.disabled = true;
            } else {
                btnInnerDrugAdd.disabled = false;
                btnInnerDrugUpdate.disabled = true;
            }
            //btnInnerDrugAdd.disabled = false;
            txtDrugLineTotal.value = (parseFloat(txtDrugPurchasePrice.value) * parseFloat(txtDrugQuantity.value)).toFixed(2);
            porderHasItem.linetotal = txtDrugLineTotal.value;
        } else {
            btnInnerDrugAdd.disabled = true;
            btnInnerDrugUpdate.disabled = true;
        }
    } else {
        btnInnerDrugAdd.disabled = true;
        btnInnerDrugUpdate.disabled = true;
    }

}

function txtGrceryQuantityCH() {

    var val = txtGrceryQuantity.value.trim();
    if (val != "") {
        var regpattern = new RegExp('^[0-9]{1,3}$');
        if (regpattern.test(val)) {
            btnInnerGroceryAdd.disabled = false;
            txtGroceryLineTotal.value = (parseFloat(txtGroceryPurchasPrice.value) * parseFloat(txtGrceryQuantity.value)).toFixed(2);
            porderHasItem.linetotal = txtGroceryLineTotal.value;
        } else {
            btnInnerGroceryAdd.disabled = true;
        }
    } else {
        btnInnerGroceryAdd.disabled = true;
    }


}

function loadForm() {
    innerGrocery.style.display = "none";
    innerDrug.style.display = "none";

    porder = new Object();
    oldporder = null;

    //create new arra
    porder.porderHasItemsList = new Array();

    // fill data into combo
    // fillCombo(feildid, message, datalist, displayproperty, selected value)
    fillCombo(cmbSupType, "Select Supplier Type", suppliertypes, "name", "");
    fillCombo(cmbSupName, "Select Supplier Name", drugsuppliers, "fullname", "");
    fillCombo(cmbQNo, "Select QNO", qnos, "qno", "");

    // fill and auto select / auto bind
    fillCombo(cmbPOStatus, "", porderstatuses, "name", "Requested");
    fillCombo(cmbAssignBy, "", employees, "callingname", session.getObject('activeuser').employeeId.callingname);

    porder.porderstatus_id = JSON.parse(cmbPOStatus.value);
    cmbPOStatus.disabled = true;

    porder.employee_id = JSON.parse(cmbAssignBy.value);
    cmbAssignBy.disabled = true;

    dteAddedDate.value = getCurrentDateTime('date');
    porder.addeddate = dteAddedDate.value;
    dteAddedDate.disabled = true;

    dteRequireDate.value = "";
    //set min date for require date
    dteRequireDate.min = getCurrentDateTime('date');
    //set max date for require date
    dteRequireDate.max = maxAndMinDate('max', dteAddedDate, 7);

    // Get Next Number Form Data Base
    var nextNumber = httpRequest("/porder/nextnumber", "GET");
    txtPOrderCode.value = nextNumber.pordercode;
    porder.pordercode = txtPOrderCode.value;
    txtPOrderCode.disabled = true;

    //textfeild empty
    cmbSupName.value = "";
    cmbSupType.value = "";
    cmbQNo.value = "";
    txtPODescription.value = "";
    txtTotalAmount.value = "";

    txtTotalAmount.disabled = true;

    setStyle(initial);

    txtPOrderCode.style.border = valid;
    dteAddedDate.style.border = valid;
    cmbPOStatus.style.border = valid;
    cmbAssignBy.style.border = valid;

    disableButtons(false, true, true);

    refreshInnerDrug();
    refreshInnerGrocery();
    cmbSupName.disabled = true;
    cmbQNo.disabled = true;

}

function setStyle(style) {
    txtPOrderCode.style.border = style;
    cmbSupType.style.border = style;
    cmbSupName.style.border = style;
    cmbQNo.style.border = style;
    cmbPOStatus.style.border = style;
    txtPODescription.style.border = style;
    txtTotalAmount.style.border = style;
    dteRequireDate.style.border = style;
    dteAddedDate.style.border = style;
    cmbAssignBy.style.border = style;

}

function disableButtons(add, upd, del) {

    if (add || !privilages.add) {
        btnAdd.setAttribute("disabled", "disabled");
        $('#btnAdd').css('cursor', 'not-allowed');
    } else {
        btnAdd.removeAttribute("disabled");
        $('#btnAdd').css('cursor', 'pointer')
    }

    if (upd || !privilages.update) {
        btnUpdate.setAttribute("disabled", "disabled");
        $('#btnUpdate').css('cursor', 'not-allowed');
    } else {
        btnUpdate.removeAttribute("disabled");
        $('#btnUpdate').css('cursor', 'pointer');
    }

    if (!privilages.update) {
        $(".buttonup").prop('disabled', true);
        $(".buttonup").css('cursor', 'not-allowed');
    } else {
        $(".buttonup").removeAttr("disabled");
        $(".buttonup").css('cursor', 'pointer');
    }

    if (!privilages.delete) {
        $(".buttondel").prop('disabled', true);
        $(".buttondel").css('cursor', 'not-allowed');
    } else {
        $(".buttondel").removeAttr("disabled");
        $(".buttondel").css('cursor', 'pointer');
    }

    // select deleted data row
    for (index in porders) {
        if (porders[index].porderstatus_id.name == "Removed") {
            tblPorder.children[1].children[index].style.color = "#f00";
            tblPorder.children[1].children[index].style.border = "2px solid red";
            tblPorder.children[1].children[index].lastChild.children[1].disabled = true;
            tblPorder.children[1].children[index].lastChild.children[1].style.cursor = "not-allowed";

        }
    }

}

function refreshInnerDrug() {
    porderHasItem = new Object();
    oldporderHasItem = null;

    totalAmount = 0;

    btnInnerDrugUpdate.disabled = true;
    btnInnerDrugAdd.disabled = true;
    txtDrugQuantity.disabled = true;

    //auto fill combobox
    if (cmbQNo.value != "") {
        subitemsByQNOCH();
    } else {
        fillCombo(cmbDrugItem, "Select Drug Item", subitems, "subitemname", "");
        //cmbDrugItem.disabled = true;
    }
    cmbDrugItem.style.border = initial;
    txtDrugQuantity.style.border = initial;

    txtDrugPurchasePrice.value = "0.00";
    txtDrugQuantity.value = "";
    txtDrugLineTotal.value = "0.00";

    // Inner Table
    fillInnerTable("tblInnerDrug", porder.porderHasItemsList, innerModify, innerDelete, true);
    if (porder.porderHasItemsList.length != 0) {
        for (var index in porder.porderHasItemsList) {
            //tblInnerDrug.children[1].children[index].lastChild.children[0].style.display= "none";
            totalAmount = (parseFloat(totalAmount) + parseFloat(porder.porderHasItemsList[index].linetotal)).toFixed(2);
        }
        txtTotalAmount.value = totalAmount;
        porder.totalamount = txtTotalAmount.value;
        if (oldporder != null && porder.totalamount != oldporder.totalamount) {
            txtTotalAmount.style.border = updated;
        } else {
            txtTotalAmount.style.border = valid;
        }

        cmbSupType.disabled = true;
        cmbSupName.disabled = true;
        cmbQNo.disabled = true;
    } else {
        totalAmount = null;
        txtTotalAmount.value = totalAmount;
        // porder.totalamount = txtTotalAmount.value;
        porder.totalamount = "";
        //txtTotalAmount.style.border = invalid;

        cmbSupType.disabled = false;
        cmbSupName.disabled = false;
        cmbQNo.disabled = false;
    }

}

function btnInnerAddDrugMc() {

    var itnext = false;
    for (var index in porder.porderHasItemsList) {
        if (porder.porderHasItemsList[index].subitem_id.subitemname == porderHasItem.subitem_id.subitemname) {
            itnext = true;
            break;
        }
    }
    if (itnext) {

        swal({
            title: 'Already Exit..!', icon: "warning",
            text: '\n',
            button: false,
            timer: 1200
        });
    } else {
        var totallineamount = 0;
        if (porder.porderHasItemsList.length != 0) {
            for (var ind in porder.porderHasItemsList) {
                totallineamount = (parseFloat(totallineamount) + parseFloat(porder.porderHasItemsList[ind].linetotal)).toFixed(2);
            }
        }
        totallineamount = (parseFloat(totallineamount) + parseFloat(porderHasItem.linetotal)).toFixed(2);

        var crdtlmt = parseFloat(JSON.parse(cmbSupName.value).creditlimit);
        console.log(crdtlmt);
        console.log(totallineamount);
        console.log(crdtlmt >= totallineamount);

        if (JSON.parse(cmbSupName.value).creditlimit != null ){
            if (crdtlmt >= totallineamount) {
                console.log("true");
                porder.porderHasItemsList.push(porderHasItem);
                refreshInnerDrug();
            } else {
                console.log("false");
                swal({
                    title: 'Credit limit Exceed..!', icon: "warning",
                    text: '\n',
                    button: false,
                    timer: 1200
                });
            }
        }else {
            console.log("no");
            porder.porderHasItemsList.push(porderHasItem);
            refreshInnerDrug();
        }

    }
}

function refreshInnerGrocery() {
    porderHasItem = new Object();
    oldporderHasItem = null;

    totalAmount = 0;

    btnInnerGroceryUpdate.disabled = true;
    btnInnerGroceryAdd.disabled = true;
    txtGrceryQuantity.disabled = true;

    //auto fill combobox
    if (cmbSupName.value != "") {
        itemsByQNOCH();
    } else {
        fillCombo(cmbGroceryItem, "Select Grocery Item", items, "itemname", "");
    }

    cmbGroceryItem.style.border = initial;
    txtGrceryQuantity.style.border = initial;

    txtGroceryPurchasPrice.value = "0.00";
    txtGrceryQuantity.value = "";
    txtGroceryLineTotal.value = "0.00";

    // Inner Table
    fillInnerTable("tblInnerGrocery", porder.porderHasItemsList, innerModify, innerDelete, true);
    if (porder.porderHasItemsList.length != 0) {
        for (var index in porder.porderHasItemsList) {
            //tblInnerGrocery.children[1].children[index].lastChild.children[0].style.display= "none";
            totalAmount = (parseFloat(totalAmount) + parseFloat(porder.porderHasItemsList[index].linetotal)).toFixed(2);
        }
        txtTotalAmount.value = totalAmount;
        porder.totalamount = txtTotalAmount.value;
        if (oldporder != null && porder.totalamount != oldporder.totalamount) {
            txtTotalAmount.style.border = updated;
        } else {
            txtTotalAmount.style.border = valid;
        }

        cmbSupType.disabled = true;
        cmbSupName.disabled = true;
        cmbQNo.disabled = true;
    } else {
        totalAmount = null;
        txtTotalAmount.value = totalAmount;
        // porder.totalamount = txtTotalAmount.value;
        porder.totalamount = "";
        //txtTotalAmount.style.border = invalid;

        cmbSupType.disabled = false;
        cmbSupName.disabled = false;
        cmbQNo.disabled = false;
    }
}

function btnInnerGroceryAddMc() {

    var itnext = false;
    for (var index in porder.porderHasItemsList) {
        if (porder.porderHasItemsList[index].item_id.itemname == porderHasItem.item_id.itemname) {
            itnext = true;
            break;
        }
    }//chech dublicate items
    if (itnext) {
        swal({
            title: 'Already Exit..!', icon: "warning",
            text: '\n',
            button: false,
            timer: 1200
        });
    } else {
        var totallineamount = 0;
        if (porder.porderHasItemsList.length != 0) {
            for (var ind in porder.porderHasItemsList) {
                totallineamount = (parseFloat(totallineamount) + parseFloat(porder.porderHasItemsList[ind].linetotal)).toFixed(2);
            }
        }
        totallineamount = (parseFloat(totallineamount) + parseFloat(porderHasItem.linetotal)).toFixed(2);

        var crdtlmt = parseFloat(JSON.parse(cmbSupName.value).creditlimit);
        console.log(crdtlmt);
        console.log(totallineamount);
        console.log(crdtlmt >= totallineamount);

        if (JSON.parse(cmbSupName.value).creditlimit != null ){
            if (crdtlmt >= totallineamount) {
                porder.porderHasItemsList.push(porderHasItem);
                refreshInnerGrocery();
            } else {
                swal({
                    title: 'Credit limit Exceed..!', icon: "warning",
                    text: '\n',
                    button: false,
                    timer: 1200
                });
            }
        }else {
            porder.porderHasItemsList.push(porderHasItem);
            refreshInnerGrocery();
        }


    }
}

function btnInnerClearMc() {
    //inner drug clear
    if (JSON.parse(cmbSupType.value).name == "Drug") {
        if (porderHasItem.subitem_id != null) {
            swal({
                title: "Are you sure to cler innerform?",
                text: "\n",
                icon: "warning", buttons: true, dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
                    refreshInnerDrug();
                }
            });
        } else {
            refreshInnerDrug();
        }
    }
    //inner grocerry clear
    else {
        if (porderHasItem.item_id != null) {
            swal({
                title: "Are you sure to cler innerform?",
                text: "\n",
                icon: "warning", buttons: true, dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
                    refreshInnerGrocery();
                }
            });
        } else {
            refreshInnerGrocery();
        }
    }

}

function innerModify(ob, innerrowno) {
    innerrow = innerrowno;

    porderHasItem = JSON.parse(JSON.stringify(ob));
    oldporderHasItem = JSON.parse(JSON.stringify(ob));

    //inner drug fill
    if (JSON.parse(cmbSupType.value).name == "Drug") {
        $('#collapseOne').collapse('show')
        btnInnerDrugUpdate.disabled = false;
        btnInnerDrugAdd.disabled = true;

        fillCombo(cmbDrugItem, "Select Drug Item", subitems, "subitemname", porderHasItem.subitem_id.subitemname);
        cmbDrugItem.disabled = true;
        txtDrugPurchasePrice.value = parseFloat(porderHasItem.purchaseprice).toFixed(2);
        txtDrugQuantity.value = porderHasItem.qty;
        txtDrugQuantity.disabled = false;
        txtDrugLineTotal.value = parseFloat(porderHasItem.linetotal).toFixed(2);
    } else {
        $('#collapseThree').collapse('show')
        btnInnerGroceryUpdate.disabled = false;
        btnInnerGroceryAdd.disabled = true;

        fillCombo(cmbGroceryItem, "Select Grocery Item", items, "itemname", porderHasItem.item_id.itemname);
        cmbGroceryItem.disabled = true;
        txtGroceryPurchasPrice.value = parseFloat(porderHasItem.purchaseprice).toFixed(2);
        txtGrceryQuantity.value = porderHasItem.qty;
        txtGrceryQuantity.disabled = false;
        txtGroceryLineTotal.value = parseFloat(porderHasItem.linetotal).toFixed(2);
    }

}

function btnInnerUpdateMc() {
    //porder.porderHasItemsList[innerrow] = porderHasItem;
        var totallineamount = 0;

        totallineamount = (parseFloat(totallineamount) + parseFloat(porderHasItem.linetotal)).toFixed(2);
        var crdtlmt = parseFloat(JSON.parse(cmbSupName.value).creditlimit);

        if (crdtlmt >= totallineamount) {
            //porder.porderHasItemsList.push(porderHasItem);
            porder.porderHasItemsList[innerrow] = porderHasItem;
            if (JSON.parse(cmbSupType.value).name == "Drug") {
                refreshInnerDrug();
            } else {
                refreshInnerGrocery();
            }
        } else {
            swal({
                title: 'Credit limit Exceed..!', icon: "warning",
                text: '\n',
                button: false,
                timer: 1200
            });
        }


}


function innerDelete(innerob, innerrow) {
    if (JSON.parse(cmbSupType.value).name == "Drug") {
        swal({
            title: "Are you sure to delete item?",
            text: "\n" +
                "Item Name : " + innerob.subitem_id.subitemname,
            icon: "warning", buttons: true, dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                porder.porderHasItemsList.splice(innerrow, 1);
                refreshInnerDrug();
            }

        });
    } else {
        swal({
            title: "Are you sure to delete item?",
            text: "\n" +
                "Item Name : " + innerob.item_id.itemname,
            icon: "warning", buttons: true, dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                porder.porderHasItemsList.splice(innerrow, 1);
                refreshInnerGrocery();
            }

        });
    }

}

function innerVeiw() {
}

function getErrors() {

    var errors = "";
    addvalue = "";

    if (cmbSupType.value == "") {
        cmbSupType.style.border = invalid;
        errors = errors + "\n" + "Supplier Type Not Selected";
    } else addvalue = 1;

    if (cmbSupName.value == "") {
        cmbSupName.style.border = invalid;
        errors = errors + "\n" + "Supplier Name Not Selected";
    } else addvalue = 1;

    if (porder.quotation_id == null) {
        cmbQNo.style.border = invalid;
        errors = errors + "\n" + "QNO Not Selected";
    } else {
        addvalue = 1;
        if (porder.porderHasItemsList.length == 0) {
            if (JSON.parse(cmbSupType.value).name == "Grocery")
                cmbGroceryItem.style.border = invalid;
            else
                cmbDrugItem.style.border = invalid;
            errors = errors + "\n" + "Item And Purchase Price Not Added";
        } else addvalue = 1;
    }

    if (porder.requiredate == null) {
        dteRequireDate.style.border = invalid;
        errors = errors + "\n" + "Required Date Not Entered";
    } else addvalue = 1;

    if (porder.totalamount == null) {
        txtTotalAmount.style.border = invalid;
        errors = errors + "\n" + "Total Amount Not Enter";
    } else addvalue = 1;

    return errors;

}

function btnAddMC() {
    if (getErrors() == "") {
        if (txtPODescription.value == "") {
            swal({
                title: "Are you sure to continue...?",
                text: "Form has some empty fields.....",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
                    savedata();
                }
            });

        } else {
            savedata();
        }
    } else {
        swal({
            title: "You have following errors",
            text: "\n" + getErrors(),
            icon: "error",
            button: true,
        });

    }
}

function savedata() {

    swal({
        title: "Are you sure to add following Purchase Order...?",
        text: "\nPorder Code : " + porder.pordercode +
            "\nSupplier Type : " + porder.quotation_id.quotationrequest_id.supplier_id.supplytype_id.name +
            "\nSupplier Name : " + porder.quotation_id.quotationrequest_id.supplier_id.fullname +
            "\nQNO : " + porder.quotation_id.qno +
            "\nRequire Date : " + porder.requiredate +
            "\nTotal Amount : " + porder.totalamount +
            "\nporder Status : " + porder.porderstatus_id.name,
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            var response = httpRequest("/porder", "POST", porder);
            if (response == "0") {
                swal({
                    position: 'center',
                    icon: 'success',
                    title: 'Your work has been Done \n Save SuccessFully..!',
                    text: '\n',
                    button: false,
                    timer: 1200
                });
                activepage = 1;
                activerowno = 1;
                loadSearchedTable();
                loadForm();
                changeTab('table');
            } else swal({
                title: 'Save not Success... , You have following errors', icon: "error",
                text: '\n ' + response,
                button: true
            });
        }loadForm();
    });

}

function btnClearMC() {
    //Get Cofirmation from the User window.confirm();
    checkerr = getErrors();

    if (porder == null && addvalue == "") {
        loadForm();
        innerGrocery.style.display = "none";
        innerDrug.style.display = "none";
    } else {
        swal({
            title: "Form has some values, updates values... Are you sure to discard the form ?",
            text: "\n",
            icon: "warning", buttons: true, dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                loadForm();
                innerGrocery.style.display = "none";
                innerDrug.style.display = "none";
            }

        });
    }

}

function fillForm(pod, rowno) {
    activerowno = rowno;

    if (oldporder == null) {
        filldata(pod);
    } else {
        swal({
            title: "Form has some values, updates values... Are you sure to discard the form ?",
            text: "\n",
            icon: "warning", buttons: true, dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                filldata(pod);
            }

        });
    }

}

// Re fill data into form
function filldata(pod) {
    clearSelection(tblPorder);
    selectRow(tblPorder, activerowno, active);

    porder = JSON.parse(JSON.stringify(pod));
    oldporder = JSON.parse(JSON.stringify(pod));

    txtPOrderCode.value = porder.pordercode;
    txtPOrderCode.disabled = "disabled";
    dteRequireDate.value = porder.requiredate;
    dateUpdateFill('max', dteRequireDate, 'porder', 'requiredate', 'oldporder', 7, 'addeddate');
    txtTotalAmount.value = porder.totalamount;
    dteAddedDate.value = porder.addeddate;

    fillCombo(cmbSupType, "Select Supplier Type", suppliertypes, "name", porder.quotation_id.quotationrequest_id.supplier_id.supplytype_id.name);
    cmbSupType.disabled = false;

    //innerform
    //if drug
    if (porder.quotation_id.quotationrequest_id.supplier_id.supplytype_id.name == "Drug") {
        fillCombo(cmbSupName, "Select Supplier Name", drugsuppliers, "fullname", porder.quotation_id.quotationrequest_id.supplier_id.fullname);
        //get qrno by drugsupplier
        qnosbysupplier = httpRequest("../quotation/bySupplier?supplierid=" + JSON.parse(cmbSupName.value).id, "GET");
        fillCombo(cmbQNo, "Select QNO", qnosbysupplier, "qno", porder.quotation_id.qno);
        refreshInnerDrug();
        //cmbSupType.disabled = false;
        innerDrug.style.display = "block";
        innerGrocery.style.display = "none";
        $('#collapseTwo').collapse('show')
    }
    //ig grocery
    else {
        fillCombo(cmbSupName, "Select Supplier Name", grocerysuppliers, "fullname", porder.quotation_id.quotationrequest_id.supplier_id.fullname);
        //get qrno by grocerysupplier
        qnosbysupplier = httpRequest("../quotation/bySupplier?supplierid=" + JSON.parse(cmbSupName.value).id, "GET");
        fillCombo(cmbQNo, "Select QNO", qnosbysupplier, "qno", porder.quotation_id.qno);
        refreshInnerGrocery();
        //cmbSupType.disabled = false;
        innerGrocery.style.display = "block";
        innerDrug.style.display = "none";
        $('#collapseFour').collapse('show')
    }

    fillCombo(cmbPOStatus, "", porderstatuses, "name", porder.porderstatus_id.name);
    cmbPOStatus.disabled = false;
    fillCombo(cmbAssignBy, "", employees, "callingname", porder.employee_id.callingname);

    disableButtons(true, false, false);
    setStyle(valid);
    changeTab('form');

    //  optional feild
    if (porder.description == null)
        txtPODescription.style.border = initial;
}

function getUpdates() {

    var updates = "";

    if (porder != null && oldporder != null) {

        if (porder.pordercode != oldporder.pordercode)
            updates = updates + "\nPorder Code is Changed " + oldporder.pordercode + " into " + porder.pordercode;

        if (porder.quotation_id.quotationrequest_id.supplier_id.supplytype_id.name != oldporder.quotation_id.quotationrequest_id.supplier_id.supplytype_id.name)
            updates = updates + "\nSupplier Type is Changed " + oldporder.quotation_id.quotationrequest_id.supplier_id.supplytype_id.name + " into " + porder.quotation_id.quotationrequest_id.supplier_id.supplytype_id.name;

        if (porder.quotation_id.quotationrequest_id.supplier_id.fullname != oldporder.quotation_id.quotationrequest_id.supplier_id.fullname)
            updates = updates + "\nSupplier Name is Changed " + oldporder.quotation_id.quotationrequest_id.supplier_id.fullname + " into " + porder.quotation_id.quotationrequest_id.supplier_id.fullname;

        if (porder.requiredate != oldporder.requiredate)
            updates = updates + "\nRequire Date is Changed " + oldporder.requiredate + " into " + porder.requiredate;

        if (porder.totalamount != oldporder.totalamount)
            updates = updates + "\nTotal Amount is Changed " + oldporder.totalamount + " into " + porder.totalamount;

        if (porder.description != oldporder.description)
            updates = updates + "\nDescription is Changed " + oldporder.description + " into " + porder.description;

        if (porder.porderstatus_id.name != oldporder.porderstatus_id.name)
            updates = updates + "\nPorder status is Changed " + oldporder.porderstatus_id.name + " into " + porder.porderstatus_id.name;

        if (porder.quotation_id.quotationrequest_id.supplier_id.supplytype_id.name == "Drug") {
            if (isEqual(porder.porderHasItemsList, oldporder.porderHasItemsList, "subitem_id"))
                updates = updates + "\nDrug Item is Changed ";
        } else {
            if (isEqual(porder.porderHasItemsList, oldporder.porderHasItemsList, "item_id"))
                updates = updates + "\nGrocery Item is Changed ";
        }
    }

    return updates;

}

// update function
function btnUpdateMC() {
    var errors = getErrors();
    if (errors == "") {
        var updates = getUpdates();
        if (updates == "")
            swal({
                title: 'Nothing Updated..!', icon: "warning",
                text: '\n',
                button: false,
                timer: 1200
            });
        else {
            swal({
                title: "Are you sure to update following Purchase Order details...?",
                text: "\n" + getUpdates(),
                icon: "warning", buttons: true, dangerMode: true,
            })
                .then((willDelete) => {
                    if (willDelete) {
                        var response = httpRequest("/porder", "PUT", porder);
                        if (response == "0") {
                            swal({
                                position: 'center',
                                icon: 'success',
                                title: 'Your work has been Done \n Update SuccessFully..!',
                                text: '\n',
                                button: false,
                                timer: 1200
                            });
                            loadSearchedTable();
                            loadForm();
                            changeTab('table');

                        } else swal({
                            title: 'Failed to add..', icon: "error",
                            text: 'You have following error \n ' + response,
                            button: true
                        });

                    }
                });
        }
    } else
        swal({
            title: 'You have following errors in your form', icon: "error",
            text: '\n ' + getErrors(),
            button: true
        });

}

function btnDeleteMC(pod) {
    porder = JSON.parse(JSON.stringify(pod));

    swal({
        title: "Are you sure to delete following Purchase Order...?",
        text: "\nPorder Code : " + porder.pordercode,
        icon: "warning", buttons: true, dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            var responce = httpRequest("/porder", "DELETE", porder);
            if (responce == 0) {
                swal({
                    title: "Deleted Successfully....!",
                    text: "\n\n  Status change to delete",
                    icon: "success", button: false, timer: 1200,
                });
                loadSearchedTable();
                loadForm();
            } else {
                swal({
                    title: "You have following erros....!",
                    text: "\n\n" + responce,
                    icon: "error", button: true,
                });
            }
        }
    });

}

function loadSearchedTable() {

    var searchtext = txtSearchName.value;

    var query = "&searchtext=";

    if (searchtext != "")
        query = "&searchtext=" + searchtext;
    //window.alert(query);
    //for load table
    loadTable(activepage, cmbPageSize.value, query);
    disableButtons(false, true, true);

}

function btnSearchMC() {
    activepage = 1;
    loadSearchedTable();
}

function btnSearchClearMC() {
    loadView();
}

function btnPrintTableMC(item) {

    var newwindow = window.open();
    formattab = tblPorder.outerHTML;

    newwindow.document.write("" +
        "<html>" +
        "<head><style type='text/css'>.google-visualization-table-th {text-align: left;} .modifybutton{display: none} .isort{display: none}</style>" +
        "<link rel='stylesheet' href='../resources/bootstrap/css/bootstrap.min.css'/></head>" +
        "<body><div style='margin-top: 150px; '> <h1>Purchase Order Details : </h1></div>" +
        "<div>" + formattab + "</div>" +
        "</body>" +
        "</html>");
    setTimeout(function () {
        newwindow.print();
        newwindow.close();
    }, 100);
}

function sortTable(cind) {
    cindex = cind;

    var cprop = tblItem.firstChild.firstChild.children[cindex].getAttribute('property');

    if (cprop.indexOf('.') == -1) {
        items.sort(
            function (a, b) {
                if (a[cprop] < b[cprop]) {
                    return -1;
                } else if (a[cprop] > b[cprop]) {
                    return 1;
                } else {
                    return 0;
                }
            }
        );
    } else {
        items.sort(
            function (a, b) {
                if (a[cprop.substring(0, cprop.indexOf('.'))][cprop.substr(cprop.indexOf('.') + 1)] < b[cprop.substring(0, cprop.indexOf('.'))][cprop.substr(cprop.indexOf('.') + 1)]) {
                    return -1;
                } else if (a[cprop.substring(0, cprop.indexOf('.'))][cprop.substr(cprop.indexOf('.') + 1)] > b[cprop.substring(0, cprop.indexOf('.'))][cprop.substr(cprop.indexOf('.') + 1)]) {
                    return 1;
                } else {
                    return 0;
                }
            }
        );
    }
    fillTable('tblSupplier', suppliers, fillForm, btnDeleteMC, viewitem);
    clearSelection(tblSupplier);
    loadForm();

    if (activerowno != "") selectRow(tblSupplier, activerowno, active);


}