

 

        window.addEventListener("load", initialize);

        //Initializing Functions

        function initialize() {

            //tooltip enable
            $('[data-toggle="tooltip"]').tooltip()

            // add / clear / update buttons Event Handler
            btnAdd.addEventListener("click",btnAddMC);
            btnClear.addEventListener("click",btnClearMC);
            btnUpdate.addEventListener("click",btnUpdateMC);

            //cmbSupType.addEventListener("change",cmbSupTypeCH);
            //cmbSupName.addEventListener("change",cmbSupNameCH);

            cmbQRNo.addEventListener("change",cmbQRNOCH);

            cmbGroceryItem.addEventListener("change",cmbGroceryItemCH);
            cmbDrugItem.addEventListener("change",cmbDrugItemCH);
            txtDrugPurchasesPrice.addEventListener("keyup",txtDrugPurchasesPriceKU);
            txtGroceryPurchasesPrice.addEventListener("keyup",txtGroceryPurchasesPriceKU);

            txtSearchName.addEventListener("keyup",btnSearchMC);

            privilages = httpRequest("../privilage?module=QUOTATION","GET");

            qrnos = httpRequest("../quotationrequest/list","GET");
            suppliertypes = httpRequest("../itemtype/list","GET");
            drugsuppliers = httpRequest("../supplier/drugnamelist","GET");
            grocerysuppliers = httpRequest("../supplier/grocerynamelist","GET");
            quotationstatuses = httpRequest("../quotationstatus/list","GET");
            employees = httpRequest("../employee/list","GET");

            //Data list for inner fillcombo box
            items = httpRequest("../item/listgrocery","GET");
            subitems = httpRequest("../subitem/list","GET");

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
            txtSearchName.value="";
            txtSearchName.style.background = "";

            //Table Area
            activerowno = "";
            activepage = 1;
            var query = "&searchtext=";
            loadTable(1,cmbPageSize.value,query);
        }

        // for fill data into table
        function loadTable(page,size,query) {
            page = page - 1;
            quotations = new Array();
          var data = httpRequest("/quotation/findAll?page="+page+"&size="+size+query,"GET");
            if(data.content!= undefined) quotations = data.content;
            createPagination('pagination',data.totalPages, data.number+1,paginate);
            fillTable('tblQuotation',quotations,fillForm,btnDeleteMC,viewitem);
            clearSelection(tblQuotation);

            if(activerowno!="")selectRow(tblQuotation,activerowno,active);

        }

        function paginate(page) {
            var paginate;
            if(olditem==null){
                paginate=true;
            }else{
                if(getErrors()==''&&getUpdates()==''){
                    paginate=true;
                }else{
                    paginate = window.confirm("Form has Some Errors or Update Values. " +
                        "Are you sure to discard that changes ?");
                }
            }
            if(paginate) {
                activepage=page;
                activerowno=""
                loadForm();
                loadSearchedTable();
            }

        }

        function viewitem(quo,rowno) {

            qview = JSON.parse(JSON.stringify(quo));

            tdqno.innerHTML = qview.qno;
            tdstype.innerHTML = qview.quotationrequest_id.supplier_id.supplytype_id.name;
            tdsname.innerHTML = qview.quotationrequest_id.supplier_id.fullname;
            tdQrno.innerHTML = qview.quotationrequest_id.qrno;
            tddtVldFrom.innerHTML = qview.validfrom;
            tddtVldTo.innerHTML = qview.validto;

            if(qview.quotationrequest_id.supplier_id.supplytype_id.name == "Drug"){
                fillInnerTable("tblPrintInnerDrugItem",qview.quotationHasItemsList,innerModify, innerDelete, innerVeiw);
                $('#lblDrug').removeAttr("style");
                $('#tblDrug').removeAttr("style");
                $('#lblGrocery').css("display","none");
                $('#tblGrocery').css("display","none");

            }else{
                $('#lblDrug').css("display","none");
                $('#tblDrug').css("display","none");
                $('#lblGrocery').removeAttr("style");
                $('#tblGrocery').removeAttr("style");
                fillInnerTable("tblPrintInnerGroceryItem",qview.quotationHasItemsList,innerModify, innerDelete, innerVeiw);
            }

            tdasign.innerHTML = qview.employee_id.callingname;
            tdaddate.innerHTML = qview.addeddate;
            tdqstatus.innerHTML = qview.quotationstatus_id.name;
            tddesc.innerHTML = qview.description;

            $('#dataVeiwModal').modal('show')


         }

         function btnPrintRowMC(){

             var format = printformtable.outerHTML;

             var newwindow=window.open();
             newwindow.document.write("<html>" +
                 "<head><style type='text/css'>.google-visualization-table-th {text-align: left;}</style>" +
                 "<link rel=\'stylesheet\' href=\'resources/bootstrap/css/bootstrap.min.css\'></head>" +
                 "<body><div style='margin-top: 150px'><h1 style='text-align: center'>Dharshana Pharmacy & Grocery</h1><h2>Quotation Details :</h2></div>" +
                 "<div>"+format+"</div>" +
                 "<script>printformtable.removeAttribute('style')</script>" +
                 "</body></html>");
             setTimeout(function () {newwindow.print(); newwindow.close();},100);
         }

        function cmbSupTypeCH() {
             cmbSupType.style.border = valid;
             cmbSupName.disabled = false;
             innerGrocery.style.display ="none";
             innerDrug.style.display = "none";
             //drug
            if(JSON.parse(cmbSupType.value).name == "Drug"){

                fillCombo(cmbSupName,"Select Supplier Name", drugsuppliers,"fullname","");

                //if supplier type changed
                if(oldquotation != null && oldquotation.quotationrequest_id.supplier_id.supplytype_id.name != JSON.parse(cmbSupType.value).name){
                    cmbSupType.style.border = updated;
                    innerGrocery.style.display ="none";
                    innerDrug.style.display = "none";

                }else{
                    cmbSupType.style.border = valid;
                }
                cmbSupName.style.border = initial;
                cmbQRNo.style.border = initial;
                cmbSupName.value == "";
                quotation.quotationrequest_id = null;
                fillCombo(cmbQRNo,"Select QRNO", qrnos,"qrno","");
                refreshInnerDrug();
                cmbQRNo.disabled = true;


                //grocery
            }else{
                fillCombo(cmbSupName,"Select Supplier Name", grocerysuppliers,"fullname","");

                cmbSupName.style.border = initial;
                //quotation.supplier_id = "";
                cmbSupName.value == "";
                cmbQRNo.style.border = initial;
                cmbSupName.value == "";
                quotation.quotationrequest_id = null;
                fillCombo(cmbQRNo,"Select QRNO", qrnos,"qrno","");
                refreshInnerGrocery();
                cmbQRNo.disabled = true;

            }

         }

         function cmbSupNameCH() {
             cmbSupName.style.border = valid;
             cmbQRNo.disabled = false;
             innerGrocery.style.display ="none";
             innerDrug.style.display = "none";

             qrnosbysupplier = httpRequest("../quotationrequest/bySupplier?supplierid="+ JSON.parse(cmbSupName.value).id ,"GET");
             fillCombo(cmbQRNo,"Select QRNO", qrnosbysupplier,"qrno","");
         }

        function subitemsByQRNOCH() {
            subitemsbyqrnos = httpRequest("../subitem/listbyqrno?qrnoid="+ JSON.parse(cmbQRNo.value).id ,"GET");
            fillCombo(cmbDrugItem,"Select Drug Items", subitemsbyqrnos,"subitemname","");
        }

        function itemsByQRNOCH() {
             itemsbyqrnos = httpRequest("../item/listbyqrno?qrnoid="+ JSON.parse(cmbQRNo.value).id ,"GET");
             fillCombo(cmbGroceryItem,"Select Grocery Items", itemsbyqrnos,"itemname","");
         }

         function cmbQRNOCH() {
             if(JSON.parse(cmbSupType.value).name == "Drug"){
                 innerDrug.style.display = "block";
                 innerGrocery.style.display ="none";
                 refreshInnerDrug();
                 subitemsByQRNOCH();

             }else {
                 innerDrug.style.display = "none";
                 innerGrocery.style.display = "block";
                 refreshInnerGrocery();
                 itemsByQRNOCH();

             }
         }

        function cmbGroceryItemCH() {
            //btnInnerGroceryAdd.disabled = false;
            txtGroceryPurchasesPrice.disabled = false;
        }

        function cmbDrugItemCH() {
            //btnInnerDrugAdd.disabled = false;
            txtDrugPurchasesPrice.disabled = false;
        }

        function txtDrugPurchasesPriceKU() {
            var val = txtDrugPurchasesPrice.value.trim();
            if (val != ""){
                var regpattern = new RegExp('^[0-9]{1,6}[.][0-9]{2}$');
                if (regpattern.test(val)){
                    if(oldquotationHasItem != null && oldquotationHasItem.purchaseprice != txtDrugPurchasesPrice.value){
                        txtDrugPurchasesPrice.style.border = updated;
                        btnInnerDrugUpdate.disabled = false;
                        btnInnerDrugAdd.disabled = true;
                    }else {
                        btnInnerDrugAdd.disabled = false;
                        btnInnerDrugUpdate.disabled = true;
                    }
                }else {
                    btnInnerDrugAdd.disabled = true;
                    btnInnerDrugUpdate.disabled = true;
                }
            }else {
                btnInnerDrugAdd.disabled = true;
                btnInnerDrugUpdate.disabled = true;
            }
        }
        function txtGroceryPurchasesPriceKU() {

            var val = txtGroceryPurchasesPrice.value.trim();
            if (val != ""){
                var regpattern = new RegExp('^[0-9]{1,6}[.][0-9]{2}$');
                if (regpattern.test(val)){
                    if(oldquotationHasItem != null && oldquotationHasItem.purchaseprice != txtGroceryPurchasesPrice.value){
                        txtGroceryPurchasesPrice.style.border = updated;
                        btnInnerGroceryUpdate.disabled = false;
                        btnInnerGroceryAdd.disabled = true;
                    }else {
                        btnInnerGroceryAdd.disabled = false;
                        btnInnerGroceryUpdate.disabled = true;
                    }
                }else {
                    btnInnerGroceryAdd.disabled = true;
                    btnInnerGroceryUpdate.disabled = true;
                }
            }else {
                btnInnerGroceryAdd.disabled = true;
                btnInnerGroceryUpdate.disabled = true;}
        }

        function loadForm() {
            innerGrocery.style.display ="none";
            innerDrug.style.display = "none";

            quotation = new Object();
            oldquotation = null;

            //create new arra
            quotation.quotationHasItemsList = new Array();

            // fill data into combo
            // fillCombo(feildid, message, datalist, displayproperty, selected value)
            fillCombo(cmbSupType,"Select Supplier Type", suppliertypes,"name","");
            fillCombo(cmbSupName,"Select Supplier Name", drugsuppliers,"fullname","");
            fillCombo(cmbQRNo,"Select QRNO", qrnos,"qrno","");

             // fill and auto select / auto bind
             fillCombo(cmbQStatus,"",quotationstatuses,"name","Valid");
             fillCombo(cmbAssignBy,"",employees,"callingname",session.getObject('activeuser').employeeId.callingname);

            quotation.quotationstatus_id=JSON.parse(cmbQStatus.value);
            cmbQStatus.disabled = true;

            quotation.employee_id=JSON.parse(cmbAssignBy.value);
            cmbAssignBy.disabled = true;

            dteAddedDate.value=getCurrentDateTime('date');;
            quotation.addeddate=dteAddedDate.value;
            dteAddedDate.disabled = true;

            dteValidfrom.value = "";
            //set min date for require date
            dteValidfrom.max = getCurrentDateTime('date');
            //set max date for require date
            dteValidfrom.min = maxAndMinDate('min',dteAddedDate,3);

            dteValidTo.value = "";
            //set min date for require date
            dteValidTo.min = getCurrentDateTime('date');
            //set max date for require date
            dteValidTo.max = maxAndMinDate('max',dteAddedDate,14);

            // Get Next Number Form Data Base
            var nextNumber = httpRequest("/quotation/nextnumber", "GET");
            txtQNo.value = nextNumber.qno;
            quotation.qno = txtQNo.value;
            txtQNo.disabled="disabled";

            //textfeild empty
            cmbSupName.value = "";
            cmbSupType.value = "";
            txtQDescription.value = "";
            dteValidfrom.value = "";
            dteValidTo.value = "";

             setStyle(initial);

            txtQNo.style.border=valid;
            dteAddedDate.style.border=valid;
            cmbQStatus.style.border=valid;
            cmbAssignBy.style.border=valid;

             disableButtons(false, true, true);

             refreshInnerDrug();
             refreshInnerGrocery();
            cmbSupName.disabled = true;
            cmbQRNo.disabled = true;

        }

        function setStyle(style) {
            txtQNo.style.border = style;
            dteValidfrom.style.border = style;
            dteValidTo.style.border = style;
            cmbQRNo.style.border = style;
            cmbSupType.style.border = style;
            cmbSupName.style.border = style;
            dteAddedDate.style.border = style;
            cmbQStatus.style.border = style;
            cmbAssignBy.style.border = style;
            txtQDescription.style.border = style;

        }

        function disableButtons(add, upd, del) {

            if (add || !privilages.add) {
                btnAdd.setAttribute("disabled", "disabled");
                $('#btnAdd').css('cursor','not-allowed');
            }
            else {
                btnAdd.removeAttribute("disabled");
                $('#btnAdd').css('cursor','pointer')
            }

            if (upd || !privilages.update) {
                btnUpdate.setAttribute("disabled", "disabled");
                $('#btnUpdate').css('cursor','not-allowed');
            }
            else {
                btnUpdate.removeAttribute("disabled");
                $('#btnUpdate').css('cursor','pointer');
             }

            if (!privilages.update) {
                $(".buttonup").prop('disabled', true);
                $(".buttonup").css('cursor','not-allowed');
            }
            else {
                $(".buttonup").removeAttr("disabled");
                $(".buttonup").css('cursor','pointer');
            }

            if (!privilages.delete){
                $(".buttondel").prop('disabled', true);
                $(".buttondel").css('cursor','not-allowed');
            }
            else {
                $(".buttondel").removeAttr("disabled");
                $(".buttondel").css('cursor','pointer');
            }

            // select deleted data row
            for(index in quotations){
                if(quotations[index].quotationstatus_id.name =="Removed"){
                    tblQuotation.children[1].children[index].style.color = "#f00";
                    tblQuotation.children[1].children[index].style.border = "2px solid red";
                    tblQuotation.children[1].children[index].lastChild.children[1].disabled = true;
                    tblQuotation.children[1].children[index].lastChild.children[1].style.cursor = "not-allowed";

                }
            }

        }

        function refreshInnerDrug() {
            quotationHasItem = new Object();
            oldquotationHasItem = null;

            btnInnerDrugAdd.disabled = true;
            btnInnerDrugUpdate.disabled = true;
            txtDrugPurchasesPrice.disabled = true;

            //auto fill combobox
            if (cmbQRNo.value != ""){
                subitemsByQRNOCH();
            }else {
                fillCombo(cmbDrugItem, "Select Drug Item", subitems, "subitemname", "");
                //cmbDrugItem.disabled = true;
            }
            cmbDrugItem.style.border=initial;
            txtDrugPurchasesPrice.style.border=initial;
            txtDrugPurchasesPrice.value = "";


            // Inner Table
            fillInnerTable("tblInnerDrug",quotation.quotationHasItemsList,innerModify, innerDelete, true);
            if(quotation.quotationHasItemsList.length !=0){
                for (var index in quotation.quotationHasItemsList){
                    //tblInnerDrug.children[1].children[index].lastChild.children[0].style.display= "none";
                }
                cmbSupType.disabled = true;
                cmbSupName.disabled = true;
                cmbQRNo.disabled = true;
            }else {
                cmbSupType.disabled = false;
                cmbSupName.disabled = false;
                cmbQRNo.disabled = false;
            }

        }

        function btnInnerAddDrugMc() {

            var itnext = false;
            for(var index in quotation.quotationHasItemsList){
                if (quotation.quotationHasItemsList[index].subitem_id.subitemname == quotationHasItem.subitem_id.subitemname ){
                    itnext = true;
                    break;
                }
            }

            if(itnext){

                swal({
                    title: 'Already Exit..!',icon: "warning",
                    text: '\n',
                    button: false,
                    timer: 1200});
            }else {
                quotation.quotationHasItemsList.push(quotationHasItem);
                refreshInnerDrug();
            }
        }

        function refreshInnerGrocery() {
            quotationHasItem = new Object();
            oldquotationHasItem = null;

            btnInnerGroceryAdd.disabled = true;
            btnInnerGroceryUpdate.disabled = true;
            txtGroceryPurchasesPrice.disabled = true;

            //auto fill combobox
            if (cmbSupName.value != ""){
                itemsByQRNOCH();
            }else {
                fillCombo(cmbGroceryItem,"Select Grocery Item", items,"itemname","");
            }

            cmbGroceryItem.style.border=initial;
            txtGroceryPurchasesPrice.style.border=initial;
            txtGroceryPurchasesPrice.value = "";

            // Inner Table
            fillInnerTable("tblInnerGrocery",quotation.quotationHasItemsList,innerModify, innerDelete, true);
            if(quotation.quotationHasItemsList.length !=0){
                for (var index in quotation.quotationHasItemsList){
                    //tblInnerGrocery.children[1].children[index].lastChild.children[0].style.display= "none";
                }
                cmbSupType.disabled = true;
                cmbSupName.disabled = true;
                cmbQRNo.disabled = true;
            }else {
                cmbSupType.disabled = false;
                cmbSupName.disabled = false;
                cmbQRNo.disabled = false;
            }
        }

        function btnInnerGroceryAddMc() {

            var itnext = false;
            for(var index in quotation.quotationHasItemsList){
                if (quotation.quotationHasItemsList[index].item_id.itemname == quotationHasItem.item_id.itemname ){
                    itnext = true;
                    break;
                }
            }

            if(itnext){

                swal({
                    title: 'Already Exit..!',icon: "warning",
                    text: '\n',
                    button: false,
                    timer: 1200});
            }else {
                quotation.quotationHasItemsList.push(quotationHasItem);
                refreshInnerGrocery();
            }
        }

        function btnInnerClearMc() {
            //inner drug clear
            if (JSON.parse(cmbSupType.value).name == "Drug"){
                if(quotationHasItem.subitem_id != null){
                    swal({
                        title: "Are you sure to cler innerform?",
                        text: "\n",
                        icon: "warning", buttons: true, dangerMode: true,
                    }).then((willDelete) => {
                        if (willDelete) {
                            refreshInnerDrug();
                        }
                    });
                }else {
                    refreshInnerDrug();
                }
            }
            //inner grocerry clear
            else {
                if(quotationHasItem.item_id != null){
                    swal({
                        title: "Are you sure to cler innerform?",
                        text: "\n",
                        icon: "warning", buttons: true, dangerMode: true,
                    }).then((willDelete) => {
                        if (willDelete) {
                            refreshInnerGrocery();
                        }
                    });
                }else {
                    refreshInnerGrocery();
                }
            }

        }

        function innerModify(ob, innerrowno) {
            innerrow = innerrowno;
            quotationHasItem = JSON.parse(JSON.stringify(ob));
            oldquotationHasItem = JSON.parse(JSON.stringify(ob));

            //inner drug fill
            if (JSON.parse(cmbSupType.value).name == "Drug") {
                $('#collapseOne').collapse('show')
                btnInnerDrugUpdate.disabled = false;
                btnInnerDrugAdd.disabled = true;

                fillCombo(cmbDrugItem, "Select Drug Item", subitems, "subitemname", quotationHasItem.subitem_id.subitemname );
                cmbDrugItem.disabled = true;
                txtDrugPurchasesPrice.value = parseFloat(quotationHasItem.purchaseprice).toFixed(2);
                txtDrugPurchasesPrice.disabled = false;

            }else{
                $('#collapseThree').collapse('show')
                btnInnerGroceryUpdate.disabled = false;
                btnInnerGroceryAdd.disabled = true;

                fillCombo(cmbGroceryItem,"Select Grocery Item", items,"itemname",quotationHasItem.item_id.itemname);
                cmbGroceryItem.disabled = true;
                txtGroceryPurchasesPrice.value = parseFloat(quotationHasItem.purchaseprice).toFixed(2);
                txtGroceryPurchasesPrice.disabled = false;
            }

        }

        function btnInnerUpdateMc(){
            quotation.quotationHasItemsList[innerrow] = quotationHasItem;
            if (JSON.parse(cmbSupType.value).name == "Drug") {
                refreshInnerDrug();
                cmbDrugItem.disabled = false;
            }else {
                refreshInnerGrocery();
                cmbGroceryItem.disabled = false;
            }
        }

        function innerDelete(innerob,innerrow) {
            if (JSON.parse(cmbSupType.value).name == "Drug"){
                swal({
                    title: "Are you sure to delete item?",
                    text: "\n" +
                        "Item Name : " + innerob.subitem_id.subitemname,
                    icon: "warning", buttons: true, dangerMode: true,
                }).then((willDelete) => {
                    if (willDelete) {
                        quotation.quotationHasItemsList.splice(innerrow,1);
                        refreshInnerDrug();
                    }

                });
            }else {
                swal({
                    title: "Are you sure to delete item?",
                    text: "\n" +
                        "Item Name : " + innerob.item_id.itemname,
                    icon: "warning", buttons: true, dangerMode: true,
                }).then((willDelete) => {
                    if (willDelete) {
                        quotation.quotationHasItemsList.splice(innerrow,1);
                        refreshInnerGrocery();
                    }

                });
            }

        }
        function innerVeiw() {}

        function getErrors() {

            var errors = "";
            //addvalue = "";

            if (cmbSupType.value == "") {
                cmbSupType.style.border = invalid;
                errors = errors + "\n" + "Supplier Type Not Selected";
            }


            if (cmbSupName.value == "") {
                cmbSupName.style.border = invalid;
                errors = errors + "\n" + "Supplier Name Not Selected";
            }


            if (quotation.quotationrequest_id == null) {
                cmbQRNo.style.border = invalid;
                errors = errors + "\n" + "QRNO Not Selected";
            }
            else {

                if (quotation.quotationHasItemsList.length == 0 ) {
                    if(JSON.parse(cmbSupType.value).name == "Grocery")
                        cmbGroceryItem.style.border = invalid;
                    else
                        cmbDrugItem.style.border = invalid;
                    errors = errors + "\n" + "Item And Purchase Price Not Added";
                }

            }

            if (quotation.validfrom == null) {
                dteValidfrom.style.border = invalid;
                errors = errors + "\n" + "Valid From Not Entered";
            }


            if (quotation.validto == null) {
                dteValidTo.style.border = invalid;
                errors = errors + "\n" + "Valid To Not Enter";
            }


            return errors;

        }

        function btnAddMC(){
            if(getErrors() == ""){
                if(txtQDescription.value==""){
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

                }else{
                    savedata();
                }
            }else{
                swal({
                    title: "You have following errors",
                    text: "\n"+getErrors(),
                    icon: "error",
                    button: true,
                });

            }
        }
        
        function savedata() {

            swal({
                title: "Are you sure to add following Quotation...?" ,
                  text :  "\nQNO : " + quotation.qno +
                    "\nSupplier Type : " + quotation.quotationrequest_id.supplier_id.supplytype_id.name +
                    "\nSupplier Name : " + quotation.quotationrequest_id.supplier_id.fullname +
                    "\nQRNO : " + quotation.quotationrequest_id.qrno +
                    "\nValid From : " + quotation.validfrom +
                    "\nValid To : " + quotation.validto +
                    "\nquotation Status : " + quotation.quotationstatus_id.name,
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
                    var response = httpRequest("/quotation", "POST", quotation);
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
                    }
                    else swal({
                        title: 'Save not Success... , You have following errors', icon: "error",
                        text: '\n ' + response,
                        button: true
                    });
                }
            });

        }

        function getCheckValidation() {

            addvalue = "";

            if (cmbSupType.value != null)  addvalue = 1;

            if (cmbSupName.value != null) addvalue = 1;

            if (quotation.quotationHasItemsList.length != 0 ) addvalue = 1;

            if (quotation.quotationrequest_id != null) addvalue = 1;

            if (quotation.quotationHasItemsList != null ) addvalue = 1;

            if (quotation.validfrom != null)  addvalue = 1;

            if (quotation.validto != null) addvalue = 1;
        }

        function btnClearMC() {
            //Get Cofirmation from the User window.confirm();
             getCheckValidation();

            if(oldquotation == null && addvalue == ""){
                loadForm();
                innerGrocery.style.display ="none";
                innerDrug.style.display = "none";
            }else{
                swal({
                    title: "Form has some values, updates values... Are you sure to discard the form ?",
                    text: "\n" ,
                    icon: "warning", buttons: true, dangerMode: true,
                }).then((willDelete) => {
                    if (willDelete) {
                        loadForm();
                        innerGrocery.style.display ="none";
                        innerDrug.style.display = "none";
                    }

                });
            }

        }

        function fillForm(quo,rowno){
            activerowno = rowno;

            if (oldquotation==null) {
                filldata(quo);
            } else {
                swal({
                    title: "Form has some values, updates values... Are you sure to discard the form ?",
                    text: "\n" ,
                    icon: "warning", buttons: true, dangerMode: true,
                }).then((willDelete) => {
                    if (willDelete) {
                        filldata(quo);
                    }

                });
            }

        }

        // Re fill data into form
        function filldata(quo) {
            clearSelection(tblQuotation);
            selectRow(tblQuotation,activerowno,active);

            quotation = JSON.parse(JSON.stringify(quo));
            oldquotation = JSON.parse(JSON.stringify(quo));

            txtQNo.value = quotation.qno;
            txtQNo.disabled="disabled";
            dteValidfrom.value = quotation.validfrom;
            dateUpdateFill('min',dteValidfrom,'quotation','validfrom','oldquotation',3,'addeddate');
            dteValidTo.value = quotation.validto;
            dateUpdateFill('max',dteValidTo,'quotation','validto','oldquotation',14,'addeddate');
            dteAddedDate.value = quotation.addeddate;

            fillCombo(cmbSupType,"Select Supplier Type", suppliertypes,"name",quotation.quotationrequest_id.supplier_id.supplytype_id.name);
            cmbSupType.disabled = false;

            //innerform
            //if drug
            if(quotation.quotationrequest_id.supplier_id.supplytype_id.name == "Drug"){
                fillCombo(cmbSupName,"Select Supplier Name", drugsuppliers,"fullname",quotation.quotationrequest_id.supplier_id.fullname);
                //get qrno by drugsupplier
                qrnosbysupplier = httpRequest("../quotationrequest/bySupplier?supplierid="+ JSON.parse(cmbSupName.value).id ,"GET");
                fillCombo(cmbQRNo,"Select QRNO", qrnosbysupplier,"qrno",quotation.quotationrequest_id.qrno);
                refreshInnerDrug();
                //cmbSupType.disabled = false;
                innerDrug.style.display = "block";
                innerGrocery.style.display = "none";
                $('#collapseTwo').collapse('show')
            }
            //if grocery
            else {
                fillCombo(cmbSupName,"Select Supplier Name", grocerysuppliers,"fullname",quotation.quotationrequest_id.supplier_id.fullname);
                //get qrno by grocerysupplier
                qrnosbysupplier = httpRequest("../quotationrequest/bySupplierUpdate?supplierid="+JSON.parse(cmbSupName.value).id,"GET");
                fillCombo(cmbQRNo,"Select QRNO", qrnosbysupplier,"qrno",quotation.quotationrequest_id.qrno);
                //console.log( cmbQRNo.value);
                //  console.log(quotation.quotationrequest_id.qrno);
                refreshInnerGrocery();
                //cmbSupType.disabled = false;
                innerGrocery.style.display = "block";
                innerDrug.style.display = "none";
                $('#collapseFour').collapse('show')
            }

            fillCombo(cmbQStatus,"",quotationstatuses,"name",quotation.quotationstatus_id.name);
            cmbQStatus.disabled = false;
            fillCombo(cmbAssignBy,"",employees,"callingname",quotation.employee_id.callingname);

            disableButtons(true, false, false);
            setStyle(valid);
            changeTab('form');

            //  optional feild
            if(quotation.description == null)
                txtQDescription.style.border = initial;
        }

        function getUpdates() {

            var updates = "";

            if(quotation!=null && oldquotation!=null) {

                if (quotation.qno != oldquotation.qno)
                    updates = updates + "\nQNO is Changed " + oldquotation.qno + " into " + quotation.qno;

                if (quotation.quotationrequest_id.supplier_id.supplytype_id.name != oldquotation.quotationrequest_id.supplier_id.supplytype_id.name)
                    updates = updates + "\nSupplier Type is Changed " + oldquotation.quotationrequest_id.supplier_id.supplytype_id.name + " into " + quotation.quotationrequest_id.supplier_id.supplytype_id.name;

                if (quotation.quotationrequest_id.supplier_id.fullname != oldquotation.quotationrequest_id.supplier_id.fullname)
                    updates = updates + "\nSupplier Name is Changed " + oldquotation.quotationrequest_id.supplier_id.fullname + " into " + quotation.quotationrequest_id.supplier_id.fullname;

                if (quotation.validfrom != oldquotation.validfrom)
                    updates = updates + "\nValid From is Changed " + oldquotation.validfrom + " into " + quotation.validfrom;

                if (quotation.validto != oldquotation.validto)
                    updates = updates + "\nValid To is Changed " + oldquotation.validto + " into " + quotation.validto;

                if (quotation.description != oldquotation.description)
                    updates = updates + "\nDescription is Changed " + oldquotation.description + " into " + quotation.description;

                if (quotation.quotationstatus_id.name != oldquotation.quotationstatus_id.name)
                    updates = updates + "\nQuotation status is Changed " + oldquotation.quotationstatus_id.name + " into " + quotation.quotationstatus_id.name;

                if(quotation.quotationrequest_id.supplier_id.supplytype_id.name=="Drug") {
                    if (isEqual(quotation.quotationHasItemsList, oldquotation.quotationHasItemsList, "subitem_id"))
                        updates = updates + "\nDrug Item is Changed ";
                }else {
                    if (isEqual(quotation.quotationHasItemsList, oldquotation.quotationHasItemsList, "item_id"))
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
                    title: 'Nothing Updated..!',icon: "warning",
                    text: '\n',
                    button: false,
                    timer: 1200});
                else {
                    swal({
                        title: "Are you sure to update following Quotation Request details...?",
                        text: "\n"+ getUpdates(),
                        icon: "warning", buttons: true, dangerMode: true,
                    })
                        .then((willDelete) => {
                        if (willDelete) {
                            var response = httpRequest("/quotation", "PUT", quotation);
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

                            }
                            else  swal({
                                    title: 'Failed to add..',icon: "error",
                                    text: 'You have following error \n '+response,
                                    button: true});

                        }
                        });
                }
            }
            else
                swal({
                    title: 'You have following errors in your form',icon: "error",
                    text: '\n '+getErrors(),
                    button: true});

        }

        function btnDeleteMC(quo) {
            quotation = JSON.parse(JSON.stringify(quo));

            swal({
                title: "Are you sure to delete following Quotatio...?",
                text: "\nSupplier Regno : " + quotation.qno,
                icon: "warning", buttons: true, dangerMode: true,
            }).then((willDelete)=> {
                if (willDelete) {
                    var responce = httpRequest("/quotation","DELETE",quotation);
                    if (responce==0) {
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

            var query ="&searchtext=";

            if(searchtext!="")
                query = "&searchtext=" + searchtext;
            //window.alert(query);
            //for load table
            loadTable(activepage, cmbPageSize.value, query);
            disableButtons(false, true, true);

        }

        function btnSearchMC(){
            activepage=1;
            loadSearchedTable();
        }

        function btnSearchClearMC(){
               loadView();
        }

       function btnPrintTableMC(item) {

            var newwindow = window.open();
            formattab = tblQuotation.outerHTML;

           newwindow.document.write("" +
                "<html>" +
                "<head><style type='text/css'>.google-visualization-table-th {text-align: left;} .modifybutton{display: none} .isort{display: none}</style>" +
                "<link rel='stylesheet' href='../resources/bootstrap/css/bootstrap.min.css'/></head>" +
                "<body><div style='margin-top: 150px; '> <h1>Quotation Details : </h1></div>" +
                "<div>"+ formattab+"</div>"+
               "</body>" +
                "</html>");
           setTimeout(function () {newwindow.print(); newwindow.close();},100) ;
        }

        function sortTable(cind) {
            cindex = cind;

         var cprop = tblItem.firstChild.firstChild.children[cindex].getAttribute('property');

           if(cprop.indexOf('.') == -1) {
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
           }else {
               items.sort(
                   function (a, b) {
                       if (a[cprop.substring(0,cprop.indexOf('.'))][cprop.substr(cprop.indexOf('.')+1)] < b[cprop.substring(0,cprop.indexOf('.'))][cprop.substr(cprop.indexOf('.')+1)]) {
                           return -1;
                       } else if (a[cprop.substring(0,cprop.indexOf('.'))][cprop.substr(cprop.indexOf('.')+1)] > b[cprop.substring(0,cprop.indexOf('.'))][cprop.substr(cprop.indexOf('.')+1)]) {
                           return 1;
                       } else {
                           return 0;
                       }
                   }
               );
           }
            fillTable('tblSupplier',suppliers,fillForm,btnDeleteMC,viewitem);
            clearSelection(tblSupplier);
            loadForm();

            if(activerowno!="")selectRow(tblSupplier,activerowno,active);



        }