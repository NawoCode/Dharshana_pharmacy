

 

        window.addEventListener("load", initialize);

        //Initializing Functions

        function initialize() {

            //tooltip enable
            $('[data-toggle="tooltip"]').tooltip()

            // add / clear / update buttons Event Handler
            btnAdd.addEventListener("click",btnAddMC);
            btnClear.addEventListener("click",btnClearMC);
            //btnUpdate.addEventListener("click",btnUpdateMC);

            //cmbSupType.addEventListener("change",cmbSupTypeCH);
            cmbSupName.addEventListener("change",cmbSupNameCH);
            cmbGrnType.addEventListener("change",cmbGrnTypeCH);
            cmbPOCode.addEventListener("change",cmbPorderCH);
            cmbSRCode.addEventListener("change",cmbSRCodeCH);

            cmbDrugItem.addEventListener("change",cmbItemDrugCH);
            cmbGroceryItem.addEventListener("change",cmbGroceryItemCH);

            txtDrugMFD.addEventListener("change",txtDrugMFDCH);
            txtDrugMFD.addEventListener("keyup",txtDrugMFDKU);

            txtDrugExp.addEventListener("change",txtDrugExpCH);
            txtDrugExp.addEventListener("keyup",txtDrugExpKU);

            txtGroceryMFD.addEventListener("change",txtGroceryMFDCH);
            txtGroceryMFD.addEventListener("keyup",txtGroceryMFDKU);

            txtGroceryExp.addEventListener("change",txtGroceryExpCH);
            txtGroceryExp.addEventListener("keyup",txtGroceryExpKU);

            txtDrugPurchasePrice.addEventListener("keyup",txtDrugPurchasePriceKU);
            txtDrugSalesPrice.addEventListener("keyup",txtDrugSalesPriceKU);

            txtGroceryPurchasePrice.addEventListener("keyup",txtGroceryPurchasePriceKU);
            txtGrocerySalesPrice.addEventListener("keyup",txtGrocerySalesPriceKU);

            txtDrugRQuantity.addEventListener("keyup",txtDrugRQuantityKU);
            txtDrugOIQuantity.addEventListener("keyup",txtDrugOIQuantityKU);
            txtDrugReturnQuantity.addEventListener("keyup",txtDrugReturnQuantityKU);

            txtGroceryRQuantity.addEventListener("keyup",txtGroceryRQuantityKU);
            txtGroceryOIQuantity.addEventListener("keyup",txtGroceryOIQuantityKU);
            txtGroceryReturnQuantity.addEventListener("keyup",txtGroceryReturnQuantityKU);

            cmbDrugBatchno.addEventListener("keyup",cmbBatchDrugCH);
            cmbGroceryBatchno.addEventListener("keyup",cmbGroceryBatchCH);

            txtDrugOIQuantity.addEventListener("keyup",txtDrugOfferQuantityCH);
            txtGroceryOIQuantity.addEventListener("keyup",txtGrceryOfferQuantityCH);

            txtDrugReturnQuantity.addEventListener("keyup",txtDrugReturnQuantityCH);
            txtGroceryReturnQuantity.addEventListener("keyup",txtGrceryReturnQuantityCH);

            txtDrugRQuantity.addEventListener("keyup",txtDrugQuantityCH);
            txtGroceryRQuantity.addEventListener("keyup",txtGrceryQuantityCH);

            txtDiscountRatio.addEventListener("keyup",txtDiscountRatioCH);

            txtSearchName.addEventListener("keyup",btnSearchMC);

            privilages = httpRequest("../privilage?module=GRN","GET");

            suppliers = httpRequest("../supplier/supplierlist","GET");
            suppliertypes = httpRequest("../itemtype/list","GET");
            drugsuppliers = httpRequest("../supplier/drugnamelist","GET");
            grocerysuppliers = httpRequest("../supplier/grocerynamelist","GET");
            poders = httpRequest("../porder/list","GET");
            supreturns = httpRequest("../suppliierretun/list","GET");
            batches = httpRequest("../batch/list","GET");
            grntypes = httpRequest("../grntype/list","GET");
            grnstatuses = httpRequest("../grnstatus/list","GET");
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
            grns = new Array();
          var data = httpRequest("/grn/findAll?page="+page+"&size="+size+query,"GET");
            if(data.content!= undefined) grns = data.content;
            createPagination('pagination',data.totalPages, data.number+1,paginate);
            fillTable('tblGrn',grns,fillForm,btnDeleteMC,viewitem);
            clearSelection(tblGrn);

            if(activerowno!="")selectRow(tblGrn,activerowno,active);

        }

        function paginate(page) {
            var paginate;
            if(oldgrn==null){
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

        function viewitem(gr,rowno) {

            grnview = JSON.parse(JSON.stringify(gr));

            tdcode.innerHTML = grnview.grncode;
            tdstype.innerHTML = grnview.supplier_id.supplytype_id.name;
            tdsname.innerHTML = grnview.supplier_id.fullname;
            tdrecdte.innerHTML = grnview.receiveddate;
            tdgrntype.innerHTML = grnview.grntype_id.name;
            tdsupbiilno.innerHTML = grnview.supplierbillno;
            tddGrandTot.innerHTML = parseFloat(grnview.grandtotal).toFixed(2);
            tddDisRatio.innerHTML = parseFloat(grnview.discountratio).toFixed(2);
            tddNetTot.innerHTML = parseFloat(grnview.nettotal).toFixed(2);

            if(grnview.grntype_id.name == "Item Only Bill"){
                tdpcode.innerHTML = grnview.porder_id.pordercode;
                $('#lblpocode').removeAttr("style");
                $('#lblsrcode').css("display","none");
            }
            if(grnview.grntype_id.name == "Return Only Bill"){
                tdsrcode.innerHTML = grnview.supplierreturn_id.supplierreturncode;
                tdreturnamount.innerHTML = parseFloat(grnview.returnamount).toFixed(2);
                $('#lblsrcode').removeAttr("style");
                $('#lblpocode').css("display","none");
            }
            if(grnview.grntype_id.name == "Item with return Item Bill"){
                tdpcode.innerHTML = grnview.porder_id.pordercode;
                tdsrcode.innerHTML = grnview.supplierreturn_id.supplierreturncode;
                tdreturnamount.innerHTML = parseFloat(grnview.returnamount).toFixed(2);
                $('#lblsrcode').removeAttr("style");
                $('#lblpocode').removeAttr("style");
               // $('#lblpocode').css("display","none");
            }
            if(grnview.grntype_id.name == "Item Bill with return amount") {
                tdpcode.innerHTML = grnview.porder_id.pordercode;
                tdsrcode.innerHTML = grnview.supplierreturn_id.supplierreturncode;
                tdreturnamount.innerHTML = parseFloat(grnview.returnamount).toFixed(2);
                $('#lblpocode').removeAttr("style");
                $('#lblsrcode').removeAttr("style");
                //$('#lblsrcode').css("display","none");
            }

            if(grnview.supplier_id.supplytype_id.name == "Drug"){
                fillInnerTable("tblPrintInnerDrugItem",grnview.grnHasBatchesList,innerModify, innerDelete, innerVeiw);
                $('#lblDrug').removeAttr("style");
                $('#tblDrug').removeAttr("style");
                $('#lblGrocery').css("display","none");
                $('#tblGrocery').css("display","none");

            }else{
                $('#lblDrug').css("display","none");
                $('#tblDrug').css("display","none");
                $('#lblGrocery').removeAttr("style");
                $('#tblGrocery').removeAttr("style");
                fillInnerTable("tblPrintInnerGroceryItem",grnview.grnHasBatchesList,innerModify, innerDelete, innerVeiw);
            }

            tdasign.innerHTML = grnview.employee_id.callingname;
            tdaddate.innerHTML = grnview.addeddate;
            tdstatus.innerHTML = grnview.grnstatus_id.name;
            tddesc.innerHTML = grnview.description;

            $('#dataVeiwModal').modal('show')

         }

         function btnPrintRowMC(){

             var format = printformtable.outerHTML;

             var newwindow=window.open();
             newwindow.document.write("<html>" +
                 "<head><style type='text/css'>.google-visualization-table-th {text-align: left;}</style>" +
                 "<link rel=\'stylesheet\' href=\'resources/bootstrap/css/bootstrap.min.css\'></head>" +
                 "<body><div style='margin-top: 150px'><h1 style='text-align: center'>Dharshana Pharmacy & Grocery</h1><h12>GRN Details :</h12></div>" +
                 "<div>"+format+"</div>" +
                 "<script>printformtable.removeAttribute('style')</script>" +
                 "</body></html>");
             setTimeout(function () {newwindow.print(); newwindow.close();},100);
         }

         //chane supplier name by given supplier type
        function cmbSupTypeCH() {
            cmbSupType.style.border = valid;
            cmbSupName.disabled = false;
            innerGrocery.style.display ="none";
            innerDrug.style.display = "none";
            //drug
            if(JSON.parse(cmbSupType.value).name == "Drug"){

                fillCombo(cmbSupName,"Select Supplier Name", drugsuppliers,"fullname","");

                //if supplier type changed
                if(oldgrn != null && oldgrn.supplier_id.supplytype_id.name != JSON.parse(cmbSupType.value).name){
                    cmbSupType.style.border = updated;
                    innerGrocery.style.display ="none";
                    innerDrug.style.display = "none";

                }else{
                    cmbSupType.style.border = valid;
                }

                cmbSupName.style.border = initial;
                cmbPOCode.style.border = initial;
                cmbGrnType.style.border = initial;
                cmbSRCode.style.border = initial;
                txtReturnamount.style.border = initial;

                grn.supplier_id = null;
                grn.grntype_id = null;
                grn.porder_id = null;
                grn.supplierreturn_id = null;
                grn.returnamount = null;

                txtReturnamount.value = null;
                fillCombo(cmbPOCode,"Select Poredr Code", poders,"pordercode","");
                fillCombo(cmbGrnType,"Select GRN Type", grntypes,"name","");
                fillCombo(cmbSRCode,"Select SR code", supreturns,"supplierreturncode","");

                cmbPOCode.disabled = true;
                cmbGrnType.disabled = true;
                cmbSRCode.disabled = true;
                txtReturnamount.disabled = true;

                //grocery
            }else{
                fillCombo(cmbSupName,"Select Supplier Name", grocerysuppliers,"fullname","");

                cmbSupName.style.border = initial;
                cmbPOCode.style.border = initial;
                cmbGrnType.style.border = initial;
                cmbSRCode.style.border = initial;
                txtReturnamount.style.border = initial;

                grn.supplier_id = null;
                grn.grntype_id = null;
                grn.porder_id = null;
                grn.supplierreturn_id = null;
                grn.returnamount = null;

                txtReturnamount.value = null;
                fillCombo(cmbPOCode,"Select Poredr Code", poders,"pordercode","");
                fillCombo(cmbGrnType,"Select GRN Type", grntypes,"name","");
                fillCombo(cmbSRCode,"Select SR code", supreturns,"supplierreturncode","");

                cmbPOCode.disabled = true;
                cmbGrnType.disabled = true;
                cmbSRCode.disabled = true;
                txtReturnamount.disabled = true;
            }

        }

        //change poder by given supplier name
        function cmbSupNameCH() {
            cmbSupName.style.border = valid;
            //cmbPOCode.disabled = false;
            cmbGrnType.disabled = false;
            innerGrocery.style.display ="none";
            innerDrug.style.display = "none";

            //if supplier name changed
            if(oldgrn != null && oldgrn.supplier_id.fullname != JSON.parse(cmbSupName.value).name){
                cmbSupName.style.border = updated;
                innerGrocery.style.display ="none";
                innerDrug.style.display = "none";

            }else{
                cmbSupName.style.border = valid;
            }
            cmbPOCode.style.border = initial;
            grn.porder_id = null;
            //podersbysupplier = httpRequest("../porder/bySupplier?supplierid="+ JSON.parse(cmbSupName.value).id ,"GET");
            fillCombo(cmbPOCode,"Select Porde Code", poders,"pordercode","");

            cmbGrnType.style.border = initial;
            cmbSRCode.style.border = initial;
            txtReturnamount.style.border = initial;

            grn.grntype_id = null;
            grn.porder_id = null;
            grn.supplierreturn_id = null;
            grn.returnamount = null;

            txtReturnamount.value = null;
            fillCombo(cmbGrnType,"Select GRN Type", grntypes,"name","");
            fillCombo(cmbSRCode,"Select SR code", supreturns,"supplierreturncode","");

            cmbPOCode.disabled = true;
            cmbSRCode.disabled = true;
            txtReturnamount.disabled = true;
        }

        // change inner sub item by given pordercode
        function subitemsByPorderCH() {
            subitemsbyporder = httpRequest("../subitem/listbyporder?porder="+ JSON.parse(cmbPOCode.value).id ,"GET");
            fillCombo(cmbDrugItem,"Select Drug Items", subitemsbyporder,"subitemname","");
        }

        // change inner item by given pordercode
        function itemsByPorderCH() {
            itemsbyporder = httpRequest("../item/listbyporder?poderid="+ JSON.parse(cmbPOCode.value).id ,"GET");
            fillCombo(cmbGroceryItem,"Select Grocery Items", itemsbyporder,"itemname","");
        }

        // change inner item by given supplierreturncode
        function itemsBySRCH() {
            itemsbysrcode = httpRequest("../item/listbysr?srid="+ JSON.parse(cmbSRCode.value).id ,"GET");
            fillCombo(cmbGroceryItem,"Select Grocery Items", itemsbysrcode,"itemname","");
        }

        // change inner item by given supplierreturn code
        function subitemsBySRCH() {
            subitemsbysrcode = httpRequest("../subitem/listbysr?srid="+ JSON.parse(cmbSRCode.value).id ,"GET");
            fillCombo(cmbDrugItem,"Select Drug Items", subitemsbysrcode,"subitemname","");
        }

        // change inner item by given supplierreturncode and pordercode
        function itemsByPorderNSRCH() {
            itemsbyporder = new Array();
            itemsbyporder = httpRequest("../item/listbyporder?poderid="+ JSON.parse(cmbPOCode.value).id ,"GET");
            //console.log(itemsbyporder);

            itemsbysrcode = new Array();
            itemsbysrcode = httpRequest("../item/listbysr?srid=" + JSON.parse(cmbSRCode.value).id, "GET");
            //console.log(itemsbysrcode);

            for (var index in itemsbysrcode){
                    var exititem = false;
                    for (var ind in itemsbyporder){
                        if(itemsbyporder[ind].id == itemsbysrcode[index].id){
                            exititem = true;
                            break;
                        }
                    }
                    if (exititem == false){
                        itemsbyporder.push(itemsbysrcode[index]);
                    }
                }

            //console.log(itemsbyporder);
            fillCombo(cmbGroceryItem, "Select Grocery Items", itemsbyporder, "itemname", "");
        }

        // change inner subitem by given supplierreturncode and pordercode
        function subitemsByPorderNSRCH() {
            subitemsbyporder = new Array();
            subitemsbyporder = httpRequest("../subitem/listbyporder?porder="+ JSON.parse(cmbPOCode.value).id ,"GET");
            //console.log(itemsbyporder);

            subitemsbysrcode = new Array();
            subitemsbysrcode = httpRequest("../subitem/listbysr?srid="+ JSON.parse(cmbSRCode.value).id ,"GET");
            //console.log(itemsbysrcode);

            for (var index in subitemsbysrcode){
                var exititem = false;
                for (var ind in subitemsbyporder){
                    if(subitemsbyporder[ind].id == subitemsbysrcode[index].id){
                        exititem = true;
                        break;
                    }
                }
                if (exititem == false){
                    subitemsbyporder.push(subitemsbysrcode[index]);
                }
            }

            //console.log(itemsbyporder);
            fillCombo(cmbDrugItem, "Select Drug Items", subitemsbyporder, "subitemname", "");
        }

        //visible inner form when select poder code
        function cmbPorderCH() {
            //if drug
            if(JSON.parse(cmbSupType.value).name == "Drug"){
                cmbDrugItem.disabled = false;
                if(JSON.parse(cmbGrnType.value).name == "Item Only Bill") { //only porder items

                    innerDrug.style.display = "block";
                    innerGrocery.style.display ="none";
                    //cmbGrnType.disabled = false;
                    subitemsByPorderCH();
                }
                if(JSON.parse(cmbGrnType.value).name == "Item with return Item Bill") { //poder and sr items

                    cmbSRCode.disabled = false;
                    innerDrug.style.display = "none";
                    innerGrocery.style.display ="none";
                    fillCombo(cmbDrugItem,"Select Drug Items", subitems,"subitemname","");
                    //subitemsByPorderCH();
                }
                if(JSON.parse(cmbGrnType.value).name == "Item Bill with return amount") { //only porder items

                    cmbSRCode.disabled = false;
                    innerDrug.style.display = "none";
                    innerGrocery.style.display ="none";
                    //fillCombo(cmbDrugItem,"Select Drug Items", subitems,"subitemname","");
                    subitemsByPorderCH();
                }

                refreshInnerDrug();
            }else {//if grocery
                cmbGroceryItem.disabled = false;
                if(JSON.parse(cmbGrnType.value).name == "Item Only Bill") {//only porder items
                    innerDrug.style.display = "none";
                    innerGrocery.style.display = "block";
                    itemsByPorderCH();
                }
                if(JSON.parse(cmbGrnType.value).name == "Item with return Item Bill"){//porde and sr items
                    cmbSRCode.disabled = false;
                    innerDrug.style.display = "none";
                    innerGrocery.style.display ="none";
                    //fillCombo(cmbGroceryItem,"Select Grocery Items", items,"itemname","");
                }
                if(JSON.parse(cmbGrnType.value).name == "Item Bill with return amount"){//only porder items
                    cmbSRCode.disabled = false;
                    innerDrug.style.display = "none";
                    innerGrocery.style.display ="none";
                    itemsByPorderCH();
                    //fillCombo(cmbGroceryItem,"Select Grocery Items", items,"itemname","");
                }
                refreshInnerGrocery();
            }
        }

        //visible inner form when select srcode
        function cmbSRCodeCH() {
            txtReturnamount.value = parseFloat(JSON.parse(cmbSRCode.value).totalamount).toFixed(2);
            grn.returnamount = txtReturnamount.value;
            txtReturnamount.style.border = valid;

            if(JSON.parse(cmbSupType.value).name == "Drug"){
                if(JSON.parse(cmbGrnType.value).name == "Return Only Bill"){//only sr items
                    innerDrug.style.display = "block";
                    innerGrocery.style.display ="none";
                    subitemsBySRCH();
                    //fillCombo(cmbDrugItem,"Select Drug Items", subitems,"subitemname","");
                }
                if(JSON.parse(cmbGrnType.value).name == "Item with return Item Bill") {//porder and sr items
                    innerDrug.style.display = "block";
                    innerGrocery.style.display = "none";
                    subitemsByPorderNSRCH
                    //fillCombo(cmbDrugItem, "Select Drug Items", subitems, "subitemname", "");
                }
                if(JSON.parse(cmbGrnType.value).name == "Item Bill with return amount"){//only porder items
                    innerDrug.style.display = "block";
                    innerGrocery.style.display = "none";
                    subitemsByPorderCH();
                    // fillCombo(cmbDrugItem, "Select Drug Items", subitems, "subitemname", "");
                }
                refreshInnerDrug();

            }else {
                if(JSON.parse(cmbGrnType.value).name == "Return Only Bill") {//only sr items
                    innerDrug.style.display = "none";
                    innerGrocery.style.display = "block";
                    itemsBySRCH();
                    //fillCombo(cmbGroceryItem, "Select Grocery Items", items, "itemname", "");
                }
                if(JSON.parse(cmbGrnType.value).name == "Item with return Item Bill") {//porder and sr items
                    innerDrug.style.display = "none";
                    innerGrocery.style.display = "block";
                    itemsByPorderNSRCH();
                    //fillCombo(cmbGroceryItem, "Select Grocery Items", items, "itemname", "");
                }
                if(JSON.parse(cmbGrnType.value).name == "Item Bill with return amount"){//only porder items
                    innerDrug.style.display = "none";
                    innerGrocery.style.display = "block";
                    //fillCombo(cmbGroceryItem, "Select Grocery Items", items, "itemname", "");
                    itemsByPorderCH();
                }
                refreshInnerGrocery();
            }
        }

        //change srcode by supplier and visible srcode by grn type
        function cmbGrnTypeCH() {
            cmbGrnType.style.border = valid;
            innerGrocery.style.display ="none";
            innerDrug.style.display = "none";

            //sr code visible, only return items
            if(JSON.parse(cmbGrnType.value).name == "Return Only Bill"){
                cmbPOCode.disabled = true;
                cmbSRCode.disabled = false;
                srcodesbysupplier = httpRequest("../suppliierretun/listbysupplier?supplierid="+ JSON.parse(cmbSupName.value).id ,"GET");
                fillCombo(cmbSRCode,"Select SR code", srcodesbysupplier,"supplierreturncode","");
                cmbSRCode.style.border = initial;
                cmbPOCode.style.border = initial;
                grn.porder_id = null;
                fillCombo(cmbPOCode,"Select Poredr Code", poders,"pordercode","");

            }else if(JSON.parse(cmbGrnType.value).name == "Item Only Bill") { //poder code visible, only porder items
                cmbPOCode.disabled = false;
                cmbSRCode.disabled = true;
                podersbysupplier = httpRequest("../porder/bySupplier?supplierid="+ JSON.parse(cmbSupName.value).id ,"GET");
                fillCombo(cmbSRCode,"Select SR code", supreturns,"supplierreturncode","");
                cmbPOCode.style.border = initial;
                cmbSRCode.style.border = initial;
                txtReturnamount.style.border = initial;
                grn.supplierreturn_id = null;
                grn.returnamount = null;
                txtReturnamount.value = null;
                fillCombo(cmbPOCode,"Select Porde Code", podersbysupplier,"pordercode","");
            }
            else if(JSON.parse(cmbGrnType.value).name == "Item with return Item Bill") { //poder code and srcode visible, porder and sr items
                cmbPOCode.disabled = false;
                cmbSRCode.disabled = true;
                srcodesbysupplier = httpRequest("../suppliierretun/listbysupplier?supplierid="+ JSON.parse(cmbSupName.value).id ,"GET");
                fillCombo(cmbSRCode,"Select SR code",srcodesbysupplier,"supplierreturncode","");
                cmbPOCode.style.border = initial;
                cmbSRCode.style.border = initial;
                //txtReturnamount.style.border = initial;
                //grn.supplierreturn_id = null;
                //grn.returnamount = null;
                //txtReturnamount.value = null;
                podersbysupplier = httpRequest("../porder/bySupplier?supplierid="+ JSON.parse(cmbSupName.value).id ,"GET");
                fillCombo(cmbPOCode,"Select Porde Code", podersbysupplier,"pordercode","");
            }
            else { //poder code and srcode visible,only porder items
                cmbPOCode.disabled = false;
                cmbSRCode.disabled = true;
                srcodesbysupplier = httpRequest("../suppliierretun/listbysupplier?supplierid="+ JSON.parse(cmbSupName.value).id ,"GET");
                fillCombo(cmbSRCode,"Select SR code",srcodesbysupplier,"supplierreturncode","");
                cmbPOCode.style.border = initial;
                cmbSRCode.style.border = initial;
                //txtReturnamount.style.border = initial;
                //grn.supplierreturn_id = null;
                //grn.returnamount = null;
                //txtReturnamount.value = null;
                podersbysupplier = httpRequest("../porder/bySupplier?supplierid="+ JSON.parse(cmbSupName.value).id ,"GET");
                fillCombo(cmbPOCode,"Select Porde Code", podersbysupplier,"pordercode","");
            }

            txtReturnamount.style.border = initial;
            grn.returnamount = null;
            txtReturnamount.value = null;
        }

        //change batch no by given drugitem id
        function cmbItemDrugCH() {
            // batcesbyitem = httpRequest("../batch/batchnolist?itemid="+JSON.parse(cmbDrugItem.value).item_id.id,"GET");
            //fillCombo(cmbDrugBatchno,"Select Batch No",batcesbyitem,"batchno","");
            txtDrugMFD.disabled = false;
            batch.item_id = JSON.parse(cmbDrugItem.value).item_id;

            //item drug item changed
            if(oldgrnHasItem != null && oldgrnHasItem.subitem_id.subitemname != JSON.parse(cmbDrugItem.value).subitemname){
                cmbDrugItem.style.border = updated;
            }
            else{
                cmbDrugItem.style.border = valid;
            }
            cmbDrugBatchno.style.border=initial;
            txtDrugRQuantity.style.border=initial;
            txtDrugOIQuantity.style.border=initial;

            txtDrugPurchasePrice.value = "0.00";
            txtDrugSalesPrice.value = "0.00";
            txtDrugRQuantity.value = "";
            txtDrugLineTotal.value = "0.00";
            txtDrugOIQuantity.value = "";
            txtDrugTRQuantity.value = "0";
            txtDrugMFD.value = "";
            txtDrugExp.value = "";

            grnHasItem.batchno = "";
            grnHasItem.purchaseprice = "";
            grnHasItem.qty = "";
            grnHasItem.linetotal = "";
            grnHasItem.offreeqty = "";
            grnHasItem.totalqty = "";
        }

        //when drug manufacture date change
        function txtDrugMFDCH() {
            txtDrugExp.disabled = false;
            txtDrugMFD.style.border = valid;
        }
        //when drug manufacture date type
        function txtDrugMFDKU() {
            var val = txtDrugMFD.value.trim();
            if (val != ""){
                var regpattern = new RegExp('^[0-9]{4}[-][0-9]{2}[-][0-9]{2}$');
                if (regpattern.test(val)){
                        txtDrugExp.disabled = false;
                        txtDrugMFD.style.border = valid;
                }else {
                    txtDrugExp.disabled = true;
                    txtDrugMFD.style.border = invalid;
                }
            }else {
                txtDrugExp.disabled = true;
                txtDrugMFD.style.border = invalid;
            }
        }
        //when drug expire date chane
        function txtDrugExpCH() {
            cmbDrugBatchno.disabled = false;
            txtDrugExp.style.border = valid;
        }
        //when drug expiredate type
        function txtDrugExpKU() {
            var val = txtDrugExp.value.trim();
            if (val != ""){
                var regpattern = new RegExp('^[0-9]{4}[-][0-9]{2}[-][0-9]{2}$');
                if (regpattern.test(val)){
                        cmbDrugBatchno.disabled = false;
                        txtDrugExp.style.border = valid;
                }else {
                    cmbDrugBatchno.disabled = true;
                    txtDrugExp.style.border = invalid;
                }
            }else {
                cmbDrugBatchno.disabled = true;
                txtDrugExp.style.border = invalid;
            }
        }

        //auto load purrchase price by given batch no for drug inner
        function cmbBatchDrugCH() {

            batchbyitemexpmfdbatchn = httpRequest("../batch/byitemexpdmfdbatchno?itemid="+JSON.parse(cmbDrugItem.value).item_id.id + "&expd=" +txtDrugExp.value + "&mfd="+txtDrugMFD.value + "&batchno=" +cmbDrugBatchno.value,"GET");
            console.log(batchbyitemexpmfdbatchn)
            if(batchbyitemexpmfdbatchn.length != 0) {
                txtDrugPurchasePrice.value = parseFloat(batchbyitemexpmfdbatchn.purchaseprice).toFixed(2);
                txtDrugSalesPrice.value = parseFloat(batchbyitemexpmfdbatchn.salesprice).toFixed(2);
                //grnHasItem.batch_id = cmbDrugBatchno.value;
                //grnHasItem.subitem_id = JSON.parse(cmbDrugItem.value).subitemname;
                grnHasItem.purchaseprice = txtDrugPurchasePrice.value;
                batch.purchaseprice = txtDrugPurchasePrice.value;
                batch.salesprice = txtDrugSalesPrice.value;
                grnHasItem.batch_id.batchno = cmbDrugBatchno.value;
                txtDrugRQuantity.disabled=false;
                txtDrugOIQuantity.disabled=false;
             }else {
                 //grnHasItem.subitem_id = JSON.parse(cmbDrugItem.value).subitemname;
                 txtDrugPurchasePrice.value = "";
                 txtDrugSalesPrice.value = "";
                txtDrugPurchasePrice.disabled=false;
             }

            //if batch no changed
            if(oldgrnHasItem != null && oldgrnHasItem.batch_id.batchno != cmbDrugBatchno.value){
                cmbDrugBatchno.style.border = updated;
                txtDrugPurchasePrice.disabled=false;
            }
            else{
                cmbDrugBatchno.style.border = valid;
                txtDrugPurchasePrice.disabled=false;
            }
            txtDrugRQuantity.style.border=initial;
            txtDrugOIQuantity.style.border=initial;

            txtDrugRQuantity.value = "";
            txtDrugLineTotal.value = "0.00";
            txtDrugOIQuantity.value = "";
            txtDrugTRQuantity.value = "0";

            grnHasItem.qty = "";
            grnHasItem.linetotal = "";
            grnHasItem.offreeqty = "";
            grnHasItem.totalqty = "";
        }
        //when drug purchase price type
        function txtDrugPurchasePriceKU() {
            var val = txtDrugPurchasePrice.value.trim();
            if (val != ""){
                var regpattern = new RegExp('^[0-9]{1,6}[.][0-9]{2}$');
                if (regpattern.test(val)){
                        txtDrugSalesPrice.disabled = false;
                        txtDrugPurchasePrice.style.border = valid;
                }else {
                    txtDrugSalesPrice.disabled = true;
                    txtDrugPurchasePrice.style.border = invalid;
                }
            }else {
                txtDrugSalesPrice.disabled = true;
                txtDrugPurchasePrice.style.border = invalid;
            }
        }
        //when drug sales price type
        function txtDrugSalesPriceKU() {
            var val = txtDrugSalesPrice.value.trim();
            if (val != ""){
                var regpattern = new RegExp('^[0-9]{1,6}[.][0-9]{2}$');
                if (regpattern.test(val)){
                    txtDrugRQuantity.disabled = false;
                    txtDrugSalesPrice.style.border = valid;
                }else {
                    txtDrugRQuantity.disabled = true;
                    txtDrugSalesPrice.style.border = invalid;
                }
            }else {
                txtDrugRQuantity.disabled = true;
                txtDrugSalesPrice.style.border = invalid;
            }
        }
        //wen drug recieved quantity type
        function txtDrugRQuantityKU() {
            var val = txtDrugRQuantity.value.trim();
            if (val != ""){
                var regpattern = new RegExp('^[0-9]{1,3}$');
                if (regpattern.test(val)){
                    txtDrugOIQuantity.disabled = false;
                    txtDrugRQuantity.style.border = valid;
                }else {
                    txtDrugOIQuantity.disabled = true;
                    txtDrugRQuantity.style.border = invalid;
                }
            }else {
                txtDrugOIQuantity.disabled = true;
                txtDrugRQuantity.style.border = invalid;
            }
        }
        //when drug offer quantity type
        function txtDrugOIQuantityKU() {
            var val = txtDrugOIQuantity.value.trim();
            if (val != ""){
                var regpattern = new RegExp('^[0-9]{1,3}$');
                if (regpattern.test(val)){
                    if (JSON.parse(cmbGrnType.value).name == "Item Only Bill" || JSON.parse(cmbGrnType.value).name == "Item with return Item Bill"){
                        btnInnerDrugAdd.disabled = false;
                    }else {
                        btnInnerDrugAdd.disabled = true;
                        txtDrugReturnQuantity.disabled = false;
                    }
                    txtDrugOIQuantity.style.border = valid;
                }else {
                    btnInnerDrugAdd.disabled = true;
                    txtDrugReturnQuantity.disabled = true;
                    txtDrugOIQuantity.style.border = invalid;
                }
            }else {
                btnInnerDrugAdd.disabled = true;
                txtDrugReturnQuantity.disabled = true;
                txtDrugOIQuantity.style.border = invalid;
            }
        }
        //when drug return quantity type
        function txtDrugReturnQuantityKU() {
            var val = txtDrugReturnQuantity.value.trim();
            if (val != ""){
                var regpattern = new RegExp('^[0-9]{1,3}$');
                if (regpattern.test(val)){
                    btnInnerDrugAdd.disabled = false;
                    txtDrugReturnQuantity.style.border = valid;
                }else {
                    btnInnerDrugAdd.disabled = true;
                    txtDrugReturnQuantity.style.border = invalid;
                }
            }else {
                btnInnerDrugAdd.disabled = true;
                txtDrugReturnQuantity.style.border = invalid;
            }
        }

        //change batch no by given groceryitem id
        function cmbGroceryItemCH() {
            //batcesbygitem = httpRequest("../batch/batchnolist?itemid="+JSON.parse(cmbGroceryItem.value).id,"GET");
            //fillCombo(cmbGroceryBatchno,"Select Batch No",batcesbygitem,"batchno","");
            txtGroceryMFD.disabled = false;

            //if grocery item changed
            if(oldgrnHasItem != null && oldgrnHasItem.item_id.itemname != JSON.parse(cmbGroceryItem.value).itemname){
                cmbGroceryItem.style.border = updated;
            }
            else{
                cmbGroceryItem.style.border = valid;
            }

            cmbGroceryBatchno.style.border=initial;
            txtGroceryRQuantity.style.border=initial;
            txtGroceryOIQuantity.style.border=initial;

            txtGroceryPurchasePrice.value = "0.00";
            txtGrocerySalesPrice.value = "0.00";
            txtGroceryRQuantity.value = "";
            txtGroceryLineTotal.value = "0.00";
            txtGroceryOIQuantity.value = "";
            txtGroceryTRQuantity.value = "0";
            txtGroceryMFD.value = "";
            txtGroceryExp.value = "";

            grnHasItem.batchno = "";
            grnHasItem.purchaseprice = "";
            grnHasItem.qty = "";
            grnHasItem.linetotal = "";
            grnHasItem.offreeqty = "";
            grnHasItem.totalqty = "";
        }
        //when grocery manufacture date change
        function txtGroceryMFDCH() {
            txtGroceryExp.disabled = false;
            txtGroceryMFD.style.border = valid;
        }
        //when grocery manufacture date type
        function txtGroceryMFDKU() {
            var val = txtGroceryMFD.value.trim();
            if (val != ""){
                var regpattern = new RegExp('^[0-9]{4}[-][0-9]{2}[-][0-9]{2}$');
                if (regpattern.test(val)){
                    txtGroceryExp.disabled = false;
                    txtGroceryMFD.style.border = valid;
                }else {
                    txtGroceryExp.disabled = true;
                    txtGroceryMFD.style.border = invalid;
                }
            }else {
                txtGroceryExp.disabled = true;
                txtGroceryMFD.style.border = invalid;
            }
        }
        //when grocery expire date chane
        function txtGroceryExpCH() {
            cmbGroceryBatchno.disabled = false;
            txtGroceryExp.style.border = valid;
        }
        //when grocery expiredate type
        function txtGroceryExpKU() {
            var val = txtGroceryExp.value.trim();
            if (val != ""){
                var regpattern = new RegExp('^[0-9]{4}[-][0-9]{2}[-][0-9]{2}$');
                if (regpattern.test(val)){
                    cmbGroceryBatchno.disabled = false;
                    txtGroceryExp.style.border = valid;
                }else {
                    cmbGroceryBatchno.disabled = true;
                    txtGroceryExp.style.border = invalid;
                }
            }else {
                cmbGroceryBatchno.disabled = true;
                txtGroceryExp.style.border = invalid;
            }
        }
        //auto load purrchase price by given batch no for grcery inner
        function cmbGroceryBatchCH() {
            batchbyitemexpmfdbatchno = httpRequest("../batch/byitemexpdmfdbatchno?itemid="+JSON.parse(cmbGroceryItem.value).id + "&expd=" +txtGroceryExp.value + "&mfd="+txtGroceryMFD.value + "&batchno=" +cmbGroceryBatchno.value,"GET");
            if (batchbyitemexpmfdbatchno.length != 0) {
                txtGroceryPurchasePrice.value = parseFloat(batchbyitemexpmfdbatchno.purchaseprice).toFixed(2);
                txtGrocerySalesPrice.value = parseFloat(batchbyitemexpmfdbatchno.salesprice).toFixed(2);
                grnHasItem.purchaseprice = txtGroceryPurchasePrice.value;
                //grnHasItem.item_id = JSON.parse(cmbGroceryItem.value).itemname;
                grnHasItem.batch_id = cmbGroceryBatchno.value;

                batch.purchaseprice = txtGroceryPurchasePrice.value;
                batch.salesprice = txtGrocerySalesPrice.value;
                txtGroceryRQuantity.disabled=false;
                txtGroceryOIQuantity.disabled=false;
            }
            else {
                txtGroceryPurchasePrice.value = null;
                txtGrocerySalesPrice.value = null;
                txtGroceryPurchasePrice.disabled=false;
            }
            txtGroceryPurchasePrice.disabled=false;
            txtGroceryRQuantity.disabled=false;
            txtGroceryOIQuantity.disabled=false;


            //if batchno changed
            if(oldgrnHasItem != null && oldgrnHasItem.batch_id.batchno != cmbGroceryBatchno.value){
                cmbGroceryBatchno.style.border = updated;
            }
            else{
                cmbGroceryBatchno.style.border = valid;
            }
            txtGroceryRQuantity.style.border=initial;
            txtGroceryOIQuantity.style.border=initial;

            txtGroceryRQuantity.value = "";
            txtGroceryLineTotal.value = "0.00";
            txtGroceryOIQuantity.value = "";
            txtGroceryTRQuantity.value = "0";

            grnHasItem.qty = "";
            grnHasItem.linetotal = "";
            grnHasItem.offreeqty = "";
            grnHasItem.totalqty = "";
        }
        //when grocery purchase price type
        function txtGroceryPurchasePriceKU() {
            var val = txtGroceryPurchasePrice.value.trim();
            if (val != ""){
                var regpattern = new RegExp('^[0-9]{1,6}[.][0-9]{2}$');
                if (regpattern.test(val)){
                    txtGrocerySalesPrice.disabled = false;
                    txtGroceryPurchasePrice.style.border = valid;
                }else {
                    txtGrocerySalesPrice.disabled = true;
                    txtGroceryPurchasePrice.style.border = invalid;
                }
            }else {
                txtGrocerySalesPrice.disabled = true;
                txtGroceryPurchasePrice.style.border = invalid;
            }
        }
        //when grocery sales price type
        function txtGrocerySalesPriceKU() {
            var val = txtGrocerySalesPrice.value.trim();
            if (val != ""){
                var regpattern = new RegExp('^[0-9]{1,6}[.][0-9]{2}$');
                if (regpattern.test(val)){
                    txtGroceryRQuantity.disabled = false;
                    txtGrocerySalesPrice.style.border = valid;
                }else {
                    txtGroceryRQuantity.disabled = true;
                    txtGrocerySalesPrice.style.border = invalid;
                }
            }else {
                txtGroceryRQuantity.disabled = true;
                txtGrocerySalesPrice.style.border = invalid;
            }
        }
        //wen grocery recieved quantity type
        function txtGroceryRQuantityKU() {
            var val = txtGroceryRQuantity.value.trim();
            if (val != ""){
                var regpattern = new RegExp('^[0-9]{1,3}$');
                if (regpattern.test(val)){
                    txtGroceryOIQuantity.disabled = false;
                    txtGroceryRQuantity.style.border = valid;
                }else {
                    txtGroceryOIQuantity.disabled = true;
                    txtGroceryRQuantity.style.border = invalid;
                }
            }else {
                txtGroceryOIQuantity.disabled = true;
                txtGroceryRQuantity.style.border = invalid;
            }
        }
        //when grocery offer quantity type
        function txtGroceryOIQuantityKU() {
            var val = txtGroceryOIQuantity.value.trim();
            if (val != ""){
                var regpattern = new RegExp('^[0-9]{1,3}$');
                if (regpattern.test(val)){
                    if (JSON.parse(cmbGrnType.value).name == "Item Only Bill" || JSON.parse(cmbGrnType.value).name == "Item with return Item Bill"){
                        btnInnerGroceryAdd.disabled = false;
                    }else {
                        btnInnerGroceryAdd.disabled = true;
                        txtGroceryReturnQuantity.disabled = false;
                    }
                    txtGroceryOIQuantity.style.border = valid;
                }else {
                    btnInnerGroceryAdd.disabled = true;
                    txtGroceryReturnQuantity.disabled = true;
                    txtGroceryOIQuantity.style.border = invalid;
                }
            }else {
                btnInnerGroceryAdd.disabled = true;
                txtGroceryReturnQuantity.disabled = true;
                txtGroceryOIQuantity.style.border = invalid;
            }
        }
        //when grocery return quantity type
        function txtGroceryReturnQuantityKU() {
            var val = txtGroceryReturnQuantity.value.trim();
            if (val != ""){
                var regpattern = new RegExp('^[0-9]{1,3}$');
                if (regpattern.test(val)){
                    btnInnerGroceryAdd.disabled = false;
                    txtGroceryReturnQuantity.style.border = valid;
                }else {
                    btnInnerGroceryAdd.disabled = true;
                    txtGroceryReturnQuantity.style.border = invalid;
                }
            }else {
                btnInnerGroceryAdd.disabled = true;
                txtGroceryReturnQuantity.style.border = invalid;
            }
        }

        //calculate line total in drug inner
        function txtDrugQuantityCH() {
            if (JSON.parse(cmbGrnType.value).name == "Item Only Bill") {
                txtDrugLineTotal.value = (parseFloat(txtDrugPurchasePrice.value) * parseFloat(txtDrugRQuantity.value)).toFixed(2);
                //txtDrugLineTotal.style.border = valid;
                grnHasItem.linetotal = txtDrugLineTotal.value;
            }
            if (JSON.parse(cmbGrnType.value).name == "Item with return Item Bill") {
                if(txtDrugRQuantity.value == 0 && txtDrugReturnQuantity.value == 0){
                    txtDrugLineTotal.value = "0.00";
                    grnHasItem.linetotal = txtDrugLineTotal.value;
                }else {
                    if (txtDrugReturnQuantity.value == 0){
                        txtDrugLineTotal.value = (parseFloat(txtDrugPurchasePrice.value) * (parseFloat(txtDrugRQuantity.value))).toFixed(2);
                        //txtDrugLineTotal.style.border = valid;
                        grnHasItem.linetotal = txtDrugLineTotal.value;
                    }else {
                        txtDrugLineTotal.value = (parseFloat(txtDrugPurchasePrice.value) * (parseFloat(txtDrugRQuantity.value) + (parseFloat(txtDrugReturnQuantity.value)))).toFixed(2);
                        //txtDrugLineTotal.style.border = valid;
                        grnHasItem.linetotal = txtDrugLineTotal.value;
                    }
                }
            }
            if (JSON.parse(cmbGrnType.value).name == "Item Bill with return amount") {
                txtDrugLineTotal.value = (parseFloat(txtDrugPurchasePrice.value) * parseFloat(txtDrugRQuantity.value)).toFixed(2);
                //txtDrugLineTotal.style.border = valid;
                grnHasItem.linetotal = txtDrugLineTotal.value;
            }
            if (JSON.parse(cmbGrnType.value).name == "Return Only Bill") {
                if(txtDrugRQuantity.value == 0){
                    txtDrugLineTotal.value = "0.00";
                }else {
                    txtDrugLineTotal.value = (parseFloat(txtDrugPurchasePrice.value) * parseFloat(txtDrugReturnQuantity.value)).toFixed(2);
                    //txtDrugLineTotal.style.border = valid;
                    grnHasItem.linetotal = txtDrugLineTotal.value;
                }
            }

        }

        //when typing received quantity calculate line total in grocery inner
        function txtGrceryQuantityCH() {
            if (JSON.parse(cmbGrnType.value).name == "Item Only Bill") {
                txtGroceryLineTotal.value = (parseFloat(txtGroceryPurchasePrice.value) * parseFloat(txtGroceryRQuantity.value)).toFixed(2);
                //txtDrugLineTotal.style.border = valid;
                grnHasItem.linetotal = txtGroceryLineTotal.value;
            }
            if (JSON.parse(cmbGrnType.value).name == "Item with return Item Bill"){
                if (txtGroceryRQuantity.value == 0 && txtGroceryReturnQuantity.value == 0){
                    txtGroceryLineTotal.value = "0.00";
                    //txtGroceryLineTotal.value = (parseFloat(txtGroceryPurchasePrice.value) * parseFloat(txtGroceryReturnQuantity.value)).toFixed(2);
                    //txtDrugLineTotal.style.border = valid;
                    grnHasItem.linetotal = txtGroceryLineTotal.value;
                }else {
                    if (txtGroceryReturnQuantity.value == 0 ){
                        txtGroceryLineTotal.value = (parseFloat(txtGroceryPurchasePrice.value) * parseFloat(txtGroceryRQuantity.value)).toFixed(2);
                        grnHasItem.linetotal = txtGroceryLineTotal.value;
                    }else {
                        txtGroceryLineTotal.value = (parseFloat(txtGroceryPurchasePrice.value) * (parseFloat(txtGroceryRQuantity.value) + parseFloat(txtGroceryReturnQuantity.value))).toFixed(2);
                        //txtDrugLineTotal.style.border = valid;
                        grnHasItem.linetotal = txtGroceryLineTotal.value;
                    }
                }
            }
            if (JSON.parse(cmbGrnType.value).name == "Item Bill with return amount"){
                txtGroceryLineTotal.value = (parseFloat(txtGroceryPurchasePrice.value) * parseFloat(txtGroceryRQuantity.value)).toFixed(2);
                //txtDrugLineTotal.style.border = valid;
                grnHasItem.linetotal = txtGroceryLineTotal.value;
            }
            if (JSON.parse(cmbGrnType.value).name == "Return Only Bill"){
                if (txtGroceryRQuantity.value == 0 ){
                    txtGroceryLineTotal.value = "0.00"
                }else {
                    txtGroceryLineTotal.value = (parseFloat(txtGroceryPurchasePrice.value) * parseFloat(txtGroceryReturnQuantity.value)).toFixed(2);
                    //txtDrugLineTotal.style.border = valid;
                    grnHasItem.linetotal = txtGroceryLineTotal.value;
                }
            }
        }

        //calculate total qty in drug inner
        function txtDrugOfferQuantityCH() {
            txtDrugTRQuantity.value = parseInt(txtDrugRQuantity.value) + parseInt(txtDrugOIQuantity.value);
            //txtDrugLineTotal.style.border = valid;
            grnHasItem.totalqty = txtDrugTRQuantity.value;
        }

        //calculate total qty in grocery inner
        function txtGrceryOfferQuantityCH() {
            txtGroceryTRQuantity.value = parseInt(txtGroceryRQuantity.value) + parseInt(txtGroceryOIQuantity.value);
            //txtDrugLineTotal.style.border = valid;
            grnHasItem.totalqty = txtGroceryTRQuantity.value;
        }

        //calculate return qty to total qty in drug inner
        function txtDrugReturnQuantityCH() {
            txtDrugTRQuantity.value = parseInt(txtDrugRQuantity.value) + parseInt(txtDrugOIQuantity.value) + parseInt(txtDrugReturnQuantity.value);
            //txtDrugLineTotal.style.border = valid;
            grnHasItem.totalqty = txtDrugTRQuantity.value;

            if (JSON.parse(cmbGrnType.value).name == "Item with return Item Bill") {
                txtDrugLineTotal.value = (parseFloat(txtDrugPurchasePrice.value) * (parseFloat(txtDrugRQuantity.value) + parseFloat(txtDrugReturnQuantity.value))).toFixed(2);
                //txtDrugLineTotal.style.border = valid;
                grnHasItem.linetotal = txtDrugLineTotal.value;
                //console.log(txtDrugReturnQuantity.value);
            }
            if (JSON.parse(cmbGrnType.value).name == "Return Only Bill") {
                txtDrugLineTotal.value = (parseFloat(txtDrugPurchasePrice.value) * parseFloat(txtDrugReturnQuantity.value)).toFixed(2);
                //txtDrugLineTotal.style.border = valid;
                grnHasItem.linetotal = txtDrugLineTotal.value;
            }
        }

        //calculate return qty to total qty in grocery inner
        function txtGrceryReturnQuantityCH() {
            txtGroceryTRQuantity.value = parseInt(txtGroceryRQuantity.value) + parseInt(txtGroceryOIQuantity.value) + parseInt(txtGroceryReturnQuantity.value);
            //txtDrugLineTotal.style.border = valid;
            grnHasItem.totalqty = txtGroceryTRQuantity.value;

            if (JSON.parse(cmbGrnType.value).name == "Item with return Item Bill"){
                txtGroceryLineTotal.value = (parseFloat(txtGroceryPurchasePrice.value) * (parseFloat(txtGroceryRQuantity.value) + parseFloat(txtGroceryReturnQuantity.value))).toFixed(2);
                //txtDrugLineTotal.style.border = valid;
                grnHasItem.linetotal = txtGroceryLineTotal.value;
            }
            if (JSON.parse(cmbGrnType.value).name == "Return Only Bill"){
                txtGroceryLineTotal.value = (parseFloat(txtGroceryPurchasePrice.value) * parseFloat(txtGroceryReturnQuantity.value)).toFixed(2);
                //txtDrugLineTotal.style.border = valid;
                grnHasItem.linetotal = txtGroceryLineTotal.value;
            }
        }

        //calculate net total
        function txtDiscountRatioCH() {
            var val = txtDiscountRatio.value.trim();
            if(val == ""){
                txtNetTotal.value = (parseFloat(txtGrandTotal.value)).toFixed(2);
                //txtDrugLineTotal.style.border = valid;
                grn.nettotal = txtNetTotal.value;
                //txtDiscountRatio.value = "0.00";
                grn.discountratio = "0.00";
                txtDiscountRatio.style.border=initial;

            }else {
                var regpattern = new RegExp('^[0-9]{1,2}[.][0-9]{2}$');
                if(regpattern.test(val)) {
                    if(val == "0.00"){
                        swal({
                            title: 'Discount Ratio must be between 0.01% and 100.00%...',icon: "warning",
                            text: '\n',
                            button: false,
                            timer: 1200});
                        txtDiscountRatio.style.border = invalid;
                        txtNetTotal.value = (parseFloat(txtGrandTotal.value)).toFixed(2);
                        //txtDrugLineTotal.style.border = valid;
                        grn.nettotal = txtNetTotal.value;
                    }else {
                        if (0.00 <= txtDiscountRatio.value && txtDiscountRatio.value <= 100.00) {
                            txtNetTotal.value = (parseFloat(txtGrandTotal.value) - (parseFloat(txtGrandTotal.value) * parseFloat(txtDiscountRatio.value) / 100)).toFixed(2);
                            //txtDrugLineTotal.style.border = valid;
                            grn.nettotal = txtNetTotal.value;
                            grn.discountratio = txtDiscountRatio.value;
                        } else {
                            txtNetTotal.value = (parseFloat(txtGrandTotal.value)).toFixed(2);
                            //txtDrugLineTotal.style.border = valid;
                            grn.nettotal = txtNetTotal.value;
                            grn.discountratio = null;
                            txtDiscountRatio.style.border = invalid;
                        }
                    }
                }
            }

            if(oldgrn != null && grn.nettotal != oldgrn.nettotal){
                txtNetTotal.style.border=updated;
            }else{
                txtNetTotal.style.border=valid   ;
            }
        }

        function loadForm() {
            innerGrocery.style.display ="none";
            innerDrug.style.display = "none";

            grn = new Object();
            oldgrn = null;

            //create new array
            grn.grnHasBatchesList = new Array();

            // fill data into combo
            // fillCombo(feildid, message, datalist, displayproperty, selected value)
            fillCombo(cmbSupType,"Select Supplier Type", suppliertypes,"name","");
            fillCombo(cmbSupName,"Select Supplier Name", suppliers,"fullname","");
            fillCombo(cmbPOCode,"Select Poredr Code", poders,"pordercode","");
            fillCombo(cmbGrnType,"Select GRN Type", grntypes,"name","");
            fillCombo(cmbSRCode,"Select SR code", supreturns,"supplierreturncode","");
            //cmbSupName.disabled = true;
            cmbPOCode.disabled = true;
            cmbGrnType.disabled = true;
            cmbSRCode.disabled = true;

             // fill and auto select / auto bind
             fillCombo(cmbStatus,"",grnstatuses,"name","Available");
             fillCombo(cmbAssignBy,"",employees,"callingname",session.getObject('activeuser').employeeId.callingname);

            grn.grnstatus_id=JSON.parse(cmbStatus.value);
            cmbStatus.disabled = true;

            grn.employee_id=JSON.parse(cmbAssignBy.value);
            cmbAssignBy.disabled = true;

            dteAddedDate.value=getCurrentDateTime('date');;
            grn.addeddate=dteAddedDate.value;
            dteAddedDate.disabled = true;

            // Get Next Number Form Data Base
            var nextNumber = httpRequest("/grn/nextnumber", "GET");
            txtGrnCode.value = nextNumber.grncode;
            grn.grncode = txtGrnCode.value;
            txtGrnCode.disabled= true;

            //textfeild empty
            cmbSupType.value ="";
            cmbSupName.value ="";
            cmbPOCode.value ="";
            cmbGrnType.value ="";
            cmbSRCode.value ="";
            txtReturnamount.value ="";
            dteReceiveDate.value ="";
            txtSupBillNo.value ="";
            txtDescription.value ="";
            txtNetTotal.value ="";
            txtGrandTotal.value ="";
            txtDiscountRatio.value ="";
            grn.discountratio ="0.00";
            grn.nettotal = "0.00";


            dteReceiveDate.value = "";
            //set min date for require date
            dteReceiveDate.max = getCurrentDateTime('date');
            //set max date for require date
            dteReceiveDate.min = maxAndMinDate('min',dteAddedDate,7);

            txtReturnamount.disabled = true;
            txtNetTotal.disabled = true;
            txtGrandTotal.disabled = true;

             setStyle(initial);

            txtGrnCode.style.border=valid;
            dteAddedDate.style.border=valid;
            cmbStatus.style.border=valid;
            cmbAssignBy.style.border=valid;

             disableButtons(false, true, true);

             refreshInnerDrug();
             refreshInnerGrocery();
            cmbSupName.disabled = true;

        }

        function setStyle(style) {

            txtGrnCode.style.border = style;
            cmbSupType.style.border = style;
            cmbSupName.style.border = style;
            cmbPOCode.style.border = style;
            cmbGrnType.style.border = style;
            cmbSRCode.style.border = style;
            txtReturnamount.style.border = style;
            dteReceiveDate.style.border = style;
            txtSupBillNo.style.border = style;
            cmbStatus.style.border = style;
            txtDescription.style.border = style;
            txtNetTotal.style.border = style;
            txtGrandTotal.style.border = style;
            txtDiscountRatio.style.border = style;
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
/*
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
            }*/

            // select deleted data row
            for(index in grns){
                tblGrn.children[1].children[index].lastChild.children[0].style.display = "none";
                tblGrn.children[1].children[index].lastChild.children[1].style.display = "none";
                if(grns[index].grnstatus_id.name =="Removed"){
                    tblGrn.children[1].children[index].style.color = "#f00";
                    tblGrn.children[1].children[index].style.border = "2px solid red";
                    tblGrn.children[1].children[index].lastChild.children[1].disabled = true;
                    tblGrn.children[1].children[index].lastChild.children[1].style.cursor = "not-allowed";

                }
            }

        }

        function refreshInnerDrug() {
            grnHasItem = new Object();
            oldgrnHasItem = null;

            batch = new Object();
            oldbatch = null;

            //btnInnerDrugUpdate.disabled = true;
            btnInnerDrugAdd.disabled = true;
            cmbDrugItem.disabled = false;
            cmbDrugBatchno.disabled = true;
            txtDrugMFD.disabled = true;
            txtDrugExp.disabled = true;
            txtDrugPurchasePrice.disabled = true;
            txtDrugSalesPrice.disabled = true;
            txtDrugRQuantity.disabled = true;
            txtDrugOIQuantity.disabled = true;
            txtDrugReturnQuantity.disabled = true;

            totalAmount= 0;


            //drug item fill
            if(cmbGrnType.value != "") {
                if (JSON.parse(cmbGrnType.value).name == "Item Only Bill") {
                    subitemsByPorderCH();
                }
                if (JSON.parse(cmbGrnType.value).name == "Item with return Item Bill") {
                    subitemsByPorderNSRCH();
                    //fillCombo(cmbDrugItem, "Select Drug Item", subitems, "subitemname", "");
                }
                if (JSON.parse(cmbGrnType.value).name == "Item Bill with return amount") {
                    subitemsByPorderCH();
                }
                if (JSON.parse(cmbGrnType.value).name == "Return Only Bill") {
                    subitemsBySRCH();
                    //fillCombo(cmbDrugItem, "Select Drug Item", subitems, "subitemname", "");
                }
            }



            //baatch no fill by given item
            if(cmbDrugItem.value != ""){
                cmbItemDrugCH();
            }else {
                // fillCombo(cmbDrugBatchno,"Select Batch No", batches,"batchno","");
                // cmbDrugBatchno.disabled = true;
            }

            cmbDrugItem.style.border=initial;
            cmbDrugBatchno.style.border=initial;
            txtDrugRQuantity.style.border=initial;
            txtDrugOIQuantity.style.border=initial;
            txtDrugReturnQuantity.style.border=initial;
            txtDrugMFD.style.border=initial;
            txtDrugExp.style.border=initial;
            txtDrugPurchasePrice.style.border=initial;
            txtDrugSalesPrice.style.border=initial;

            cmbDrugBatchno.value = "";
            txtDrugPurchasePrice.value = "";
            txtDrugSalesPrice.value = "";
            txtDrugRQuantity.value = "";
            txtDrugLineTotal.value = "0.00";
            txtDrugOIQuantity.value = "";
            txtDrugReturnQuantity.value = "";
            txtDrugTRQuantity.value = "0";
            txtDrugMFD.value = "";
            txtDrugExp.value = "";

            // txtDrugRQuantity.disabled=true;
            // txtDrugOIQuantity.disabled=true;


            // Inner Table
            fillInnerTable("tblInnerDrug",grn.grnHasBatchesList,innerModify, innerDelete, innerVeiw);
            if(grn.grnHasBatchesList.length != 0){
                for (var index in grn.grnHasBatchesList){
                    tblInnerDrug.children[1].children[index].lastChild.children[0].style.display= "none";
                    totalAmount = (parseFloat(totalAmount) + parseFloat(grn.grnHasBatchesList[index].linetotal)).toFixed(2);
                }
                if(JSON.parse(cmbGrnType.value).name == "Item with return Item Bill" || JSON.parse(cmbGrnType.value).name == "Item Bill with return amount" || JSON.parse(cmbGrnType.value).name == "Return Only Bill"){
                    txtGrandTotal.value = (parseFloat(totalAmount) - parseFloat(txtReturnamount.value)).toFixed(2);
                    grn.grandtotal = txtGrandTotal.value;
                    txtDiscountRatioCH();
                }else {
                    txtGrandTotal.value = totalAmount;
                    grn.grandtotal = txtGrandTotal.value;
                    txtDiscountRatioCH();
                }
                if(oldgrn != null && grn.grandtotal != oldgrn.grandtotal){
                    txtDiscountRatioCH();
                    txtGrandTotal.style.border=updated;
                }else{
                    txtGrandTotal.style.border=valid   ;
                }

                cmbSupType.disabled = true;
                cmbSupName.disabled = true;
                cmbPOCode.disabled = true;
                cmbGrnType.disabled = true;
                cmbSRCode.disabled = true;
            }else {
                totalAmount = null;
                txtGrandTotal.value = totalAmount;
                // porder.totalamount = txtTotalAmount.value;
                grn.grandtotal = "";
                //txtTotalAmount.style.border = invalid;

                cmbSupType.disabled = false;
                cmbSupName.disabled = false;
            }

        }

        function btnInnerAddDrugMc() {

            grnHasItem.purchaseprice = txtDrugPurchasePrice.value;
            grnHasItem.batch_id = batch;
            console.log(grnHasItem)
            var itnext = false;
            for(var index in grn.grnHasBatchesList){
                if (grn.grnHasBatchesList[index].subitem_id.subitemname == grnHasItem.batch_id.subitem_id.subitemname ){
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
                grn.grnHasBatchesList.push(grnHasItem);
                refreshInnerDrug();

            }
        }

        function refreshInnerGrocery() {
            grnHasItem = new Object();
            oldgrnHasItem = null;

            batch = new Object();
            oldbatch = null;

            totalAmount = 0;

            btnInnerGroceryAdd.disabled=true;
            txtGroceryMFD.disabled=true;
            txtGroceryExp.disabled=true;
            cmbGroceryBatchno.disabled=true;
            txtGroceryPurchasePrice.disabled=true;
            txtGrocerySalesPrice.disabled=true;
            txtGroceryRQuantity.disabled=true;
            txtGroceryOIQuantity.disabled=true;
            txtGroceryReturnQuantity.disabled=true;

            /*//auto fill combobox
            if (cmbPOCode.value != ""){
                itemsByPorderCH();
            }else {
                fillCombo(cmbGroceryItem,"Select Grocery Item",items,"itemname","");
            }*/

            //grocery item fills
            if(cmbGrnType.value != "") {
                if (JSON.parse(cmbGrnType.value).name == "Item Only Bill") {
                    itemsByPorderCH();
                }
                if (JSON.parse(cmbGrnType.value).name == "Item with return Item Bill") {
                    itemsByPorderNSRCH();
                    //fillCombo(cmbGroceryItem, "Select Grocery Item", items, "itemname", "");
                }
                if (JSON.parse(cmbGrnType.value).name == "Item Bill with return amount") {
                    itemsByPorderCH();
                }
                if (JSON.parse(cmbGrnType.value).name == "Return Only Bill") {
                    itemsBySRCH();
                    //fillCombo(cmbGroceryItem, "Select Grocery Item", items, "itemname", "");
                }
            }

            if(cmbGroceryItem.value != ""){
                cmbGroceryItemCH();
            }else {
                // fillCombo(cmbGroceryBatchno,"Select Batch No",batches,"batchno","");
                // cmbGroceryBatchno.disabled = true;
            }

            cmbGroceryItem.style.border=initial;
            cmbGroceryBatchno.style.border=initial;
            txtGroceryRQuantity.style.border=initial;
            txtGroceryOIQuantity.style.border=initial;
            txtGroceryReturnQuantity.style.border=initial;
            txtGroceryPurchasePrice.style.border=initial;
            txtGrocerySalesPrice.style.border=initial;
            txtGroceryMFD.style.border=initial;
            txtGroceryExp.style.border=initial;

            cmbGroceryBatchno.value = "";
            txtGroceryPurchasePrice.value = "";
            txtGrocerySalesPrice.value = "";
            txtGroceryRQuantity.value = "";
            txtGroceryLineTotal.value = "0.00";
            txtGroceryOIQuantity.value = "";
            txtGroceryReturnQuantity.value = "";
            txtGroceryTRQuantity.value = "0";
            txtGroceryMFD.value = "";
            txtGroceryExp.value = "";


            // Inner Table
            fillInnerTable("tblInnerGrocery",grn.grnHasBatchesList,innerModify, innerDelete, innerVeiw);
            if(grn.grnHasBatchesList.length != 0){
                for (var index in grn.grnHasBatchesList){
                    tblInnerGrocery.children[1].children[index].lastChild.children[0].style.display= "none";
                    totalAmount = (parseFloat(totalAmount) + parseFloat(grn.grnHasBatchesList[index].linetotal)).toFixed(2);
                }
                if(JSON.parse(cmbGrnType.value).name == "Item with return Item Bill" || JSON.parse(cmbGrnType.value).name == "Item Bill with return amount" || JSON.parse(cmbGrnType.value).name == "Return Only Bill"){
                    txtGrandTotal.value = (parseFloat(totalAmount) - parseFloat(txtReturnamount.value)).toFixed(2);
                    grn.grandtotal = txtGrandTotal.value;
                    txtDiscountRatioCH();
                }else {
                    txtGrandTotal.value = totalAmount;
                    grn.grandtotal = txtGrandTotal.value;
                    txtDiscountRatioCH();
                }
                if(oldgrn != null && grn.grandtotal != oldgrn.grandtotal){
                    txtDiscountRatioCH();
                    txtGrandTotal.style.border=updated;
                }else{
                    txtGrandTotal.style.border=valid   ;
                }

                cmbSupType.disabled = true;
                cmbSupName.disabled = true;
                cmbPOCode.disabled = true;
                cmbGrnType.disabled = true;
                cmbSRCode.disabled = true;
            }else {
                totalAmount = null;
                txtGrandTotal.value = totalAmount;
                // porder.totalamount = txtTotalAmount.value;
                grn.grandtotal = "";
                //txtTotalAmount.style.border = invalid;

                cmbSupType.disabled = false;
                cmbSupName.disabled = false;
            }
        }

        function btnInnerGroceryAddMc() {

            grnHasItem.purchaseprice = txtGroceryPurchasePrice.value;
            grnHasItem.batch_id = batch;
            console.log(grnHasItem);
            var itnext = false;
            for(var index in grn.grnHasBatchesList){
                if (grn.grnHasBatchesList[index].item_id.itemname == grnHasItem.item_id.itemname ){
                    itnext = true;
                    break;
                }
            }//chech dublicate items
            if(itnext){
                swal({
                    title: 'Already Exit..!',icon: "warning",
                    text: '\n',
                    button: false,
                    timer: 1200});
            }else {
                grn.grnHasBatchesList.push(grnHasItem);
                refreshInnerGrocery();

            }
        }

        function btnInnerClearMc() {
            //inner drug clear
            if (JSON.parse(cmbSupType.value).name == "Drug"){
                if(grnHasItem.subitem_id != null){
                    swal({
                        title: "Are you sure to cler innerform?",
                        text: "\n",
                        icon: "warning", buttons: true, dangerMode: true,
                    }).then((willDelete) => {
                        if (willDelete) {
                            refreshInnerDrug();
                            cmbDrugItem.disabled=false;
                        }
                    });
                }else {
                    refreshInnerDrug();
                    cmbDrugItem.disabled=false;
                }
            }
            //inner grocerry clear
            else {
                if(grnHasItem.item_id != null){
                    swal({
                        title: "Are you sure to clear innerform?",
                        text: "\n",
                        icon: "warning", buttons: true, dangerMode: true,
                    }).then((willDelete) => {
                        if (willDelete) {
                            refreshInnerGrocery();
                            cmbGroceryItem.disabled=false;
                        }
                    });
                }else {
                    refreshInnerGrocery();
                    cmbGroceryItem.disabled=false;
                }
            }

        }

        function innerModify(ob, innerrowno) {
            innerrow = innerrowno;
            grnHasItem = ob;

            //inner drug fill
            if (JSON.parse(cmbSupType.value).name == "Drug") {
                $('#collapseOne').collapse('show')
                btnInnerDrugUpdate.disabled = false;
                btnInnerDrugAdd.disabled = true;

                fillCombo(cmbDrugItem, "Select Drug Item", subitems, "subitemname", grnHasItem.subitem_id.subitemname );
                cmbDrugItem.disabled = true;
                //batcesbyitem = httpRequest("../batch/batchnolist?itemid="+JSON.parse(cmbDrugItem.value).id,"GET");
                //fillCombo(cmbDrugBatchno,"Select Batch No",batcesbyitem,"batchno",grnHasItem.batch_id.batchno);
                cmbDrugBatchno.value = grnHasItem.batch_id.batchno;
                txtDrugPurchasePrice.value = parseFloat(grnHasItem.purchaseprice).toFixed(2);
                txtDrugSalesPrice.value = parseFloat(grnHasItem.batch_id.salesprice).toFixed(2);
                txtDrugRQuantity.value = grnHasItem.qty;
                txtDrugOIQuantity.value = grnHasItem.offreeqty;
                txtDrugReturnQuantity.value = grnHasItem.returnqty;
                txtDrugTRQuantity.value = grnHasItem.totalqty;
                txtDrugRQuantity.disabled = false;
                txtDrugOIQuantity.disabled = false;
                txtDrugLineTotal.value = parseFloat(grnHasItem.linetotal).toFixed(2);
                txtDrugMFD.value = grnHasItem.batch_id.mfdate;
                txtDrugExp.value = grnHasItem.batch_id.expdate;
            }else{
                $('#collapseThree').collapse('show')
                btnInnerGroceryUpdate.disabled = false;
                btnInnerGroceryAdd.disabled = true;

                fillCombo(cmbGroceryItem,"Select Grocery Item", items,"itemname",grnHasItem.batch_id.item_id.itemname);
                cmbGroceryItem.disabled = true;
                // batcesbygitem = httpRequest("../batch/batchnolist?itemid="+JSON.parse(cmbGroceryItem.value).id,"GET");
                // fillCombo(cmbGroceryBatchno,"Select Batch No",batcesbygitem,"batchno",grnHasItem.batch_id.batchno);
                cmbGroceryBatchno.value = grnHasItem.batch_id.batchno;
                txtGroceryPurchasePrice.value = parseFloat(grnHasItem.purchaseprice).toFixed(2);
                txtGrocerySalesPrice.value = parseFloat(grnHasItem.batch_id.salesprice).toFixed(2);
                txtGroceryRQuantity.value = grnHasItem.qty;
                txtGroceryOIQuantity.value = grnHasItem.offreeqty;
                txtGroceryReturnQuantity.value = grnHasItem.returnqty;
                txtGroceryTRQuantity.value = grnHasItem.totalqty;
                txtGroceryRQuantity.disabled = false;
                txtGroceryOIQuantity.disabled = false;
                txtGroceryLineTotal.value = parseFloat(grnHasItem.linetotal).toFixed(2);
                txtGroceryMFD.value = grnHasItem.batch_id.mfdate;
                txtGroceryExp.value = grnHasItem.batch_id.expdate;

            }

        }

        function btnInnerUpdateMc(){
            grn.grnHasBatchesList[innerrow] = grnHasItem;
            if (JSON.parse(cmbSupType.value).name == "Drug") {
                refreshInnerDrug();
            }else {
                refreshInnerGrocery();
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
                        grn.grnHasBatchesList.splice(innerrow,1);
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
                        grn.grnHasBatchesList.splice(innerrow,1);
                        refreshInnerGrocery();
                    }

                });
            }

        }
        function innerVeiw() {}

        function getErrors() {

            var errors = "";
            addvalue = "";

            if (cmbSupType.value == "") {
                cmbSupType.style.border = invalid;
                errors = errors + "\n" + "Supplier Type Not Selected";
            }
            else  addvalue = 1;

            if (grn.supplier_id == null) {
                cmbSupName.style.border = invalid;
                errors = errors + "\n" + "Supplier Name Not Enter";
            }
            else  addvalue = 1;

            if (grn.grntype_id == null) {
                cmbGrnType.style.border = invalid;
                errors = errors + "\n" + "GRN Type Not Selected";
            }
            else {
                addvalue = 1;
                if(grn.grntype_id.name == "Return Only Bill"){
                    if (grn.supplierreturn_id == null) {
                        cmbSRCode.style.border = invalid;
                        errors = errors + "\n" + "SRCode Not Selected";
                    }
                    else {
                        addvalue = 1;
                        if (grn.grnHasBatchesList.length == 0 ) {
                            if(JSON.parse(cmbSupType.value).name == "Grocery")
                                cmbGroceryItem.style.border = invalid;
                            else
                                cmbDrugItem.style.border = invalid;
                            errors = errors + "\n" + "Item And Other details Not Added";
                        }
                        else  addvalue = 1;
                    }
                }else {
                    if (grn.porder_id == null) {
                        cmbPOCode.style.border = invalid;
                        errors = errors + "\n" + "Porder Code Not Selected";
                    }
                    else {
                        addvalue = 1;
                        if (grn.grnHasBatchesList.length == 0 ) {
                            if(JSON.parse(cmbSupType.value).name == "Grocery")
                                cmbGroceryItem.style.border = invalid;
                            else
                                cmbDrugItem.style.border = invalid;
                            errors = errors + "\n" + "Item And Other details Not Added";
                        }
                        else  addvalue = 1;
                    }
                }
            }

            if (grn.receiveddate == null) {
                dteReceiveDate.style.border = invalid;
                errors = errors + "\n" + "Received Date Not Entered";
            }
            else  addvalue = 1;

            if (grn.supplierbillno == null) {
                txtSupBillNo.style.border = invalid;
                errors = errors + "\n" + "Supplier Bill Not Entered";
            }
            else  addvalue = 1;

            /*if (grn.grandtotal == null) {
                txtGrandTotal.style.border = invalid;
                errors = errors + "\n" + "Grand total Not Entered";
            }
            else  addvalue = 1;*/

           if (grn.discountratio == null) {
                txtDiscountRatio.style.border = invalid;
                errors = errors + "\n" + "Discount Ratio Not Entered";
            }
            else  addvalue = 1;
/*
            if (grn.nettotal == null) {
                txtNetTotal.style.border = invalid;
                errors = errors + "\n" + "Net Total Not Entered";
            }
            else  addvalue = 1;*/

            return errors;

        }

        function btnAddMC(){
            if(getErrors() == ""){
                if(txtDescription.value==""){
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

            var poder = "";
            if(grn.porder_id != null){
                poder = "\nPorder Code : " + grn.porder_id.pordercode;
            }

            var supreturn = "";
            if(grn.supplierreturn_id != null){
                supreturn = supreturn + "\nSR Code : " + grn.supplierreturn_id.supplierreturncode;
                supreturn = supreturn + "\nReturn Amount(Rs.) : " + grn.returnamount;
            }


            swal({
                title: "Are you sure to add following Supplier Return...?" ,
                  text :  "\nGRN Code : " + grn.grncode +
                    "\nSupplier Type : " + grn.supplier_id.supplytype_id.name +
                    "\nSupplier Name : " + grn.supplier_id.fullname +
                      "\nGrn Type : " + grn.grntype_id.name +
                      poder +
                      supreturn +
                    "\nReceive Date : " + grn.receiveddate +
                    "\nSupplier Billno : " + grn.supplierbillno +
                    "\nGrand Total(Rs.) : " + grn.grandtotal +
                    "\nDiscount Ratio : " + grn.discountratio + "%" +
                    "\nNet Total(Rs.) : " + grn.nettotal +
                    "\ngrn Status : " + grn.grnstatus_id.name,
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
                    var response = httpRequest("/grn", "POST", grn);
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

        function btnClearMC() {
            //Get Cofirmation from the User window.confirm();
            checkerr = getErrors();

            if(grn == null && addvalue == ""){
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
                    }loadForm();

                });
            }

        }

        function fillForm(gr,rowno){
            activerowno = rowno;

            if (oldgrn==null) {
                filldata(gr);
            } else {
                swal({
                    title: "Form has some values, updates values... Are you sure to discard the form ?",
                    text: "\n" ,
                    icon: "warning", buttons: true, dangerMode: true,
                }).then((willDelete) => {
                    if (willDelete) {
                        filldata(gr);
                    }

                });
            }

        }

        // Re fill data into form
        function filldata(gr) {
            clearSelection(tblGrn);
            selectRow(tblGrn,activerowno,active);

            grn = JSON.parse(JSON.stringify(gr));
            oldgrn = JSON.parse(JSON.stringify(gr));

            txtGrnCode.value = grn.grncode;
            txtGrnCode.disabled="disabled";
            dteReceiveDate.value = grn.receiveddate;
            dateUpdateFill('min',dteReceiveDate,'grn','receiveddate','oldgrn',7,'addeddate');
            txtSupBillNo.value = grn.supplierbillno;
            txtNetTotal.value = parseFloat(grn.nettotal).toFixed(2);
            txtGrandTotal.value = parseFloat(grn.grandtotal).toFixed(2);
            txtDiscountRatio.value = parseFloat(grn.discountratio).toFixed(2);
            dteAddedDate.value = grn.addeddate;
            txtDescription.value = grn.description;

            fillCombo(cmbSupType,"Select Supplier Type", suppliertypes,"name",grn.supplier_id.supplytype_id.name);
            cmbSupType.disabled = false;

            fillCombo(cmbGrnType,"Select GRN Type", grntypes,"name",grn.grntype_id.name);
            cmbGrnType.disabled = false;

            if(JSON.parse(cmbGrnType.value).name == "Item Only Bill") {//only porder code visible
                cmbPOCode.disabled = true;
                cmbSRCode.disabled = true;
                podersbysupplier = httpRequest("../porder/bySupplier?supplierid="+ grn.supplier_id.id ,"GET");
                fillCombo(cmbPOCode,"Select Porde Code", podersbysupplier,"pordercode",grn.porder_id.pordercode);
                grn.supplierreturn_id = null;
                fillCombo(cmbSRCode,"Select SR code", supreturns,"supplierreturncode","");
                txtReturnamount.value = null;
            }
            if(JSON.parse(cmbGrnType.value).name == "Item with return Item Bill"){//pordecode and srcode visible
                cmbPOCode.disabled = true;
                cmbSRCode.disabled = true;
                podersbysupplier = httpRequest("../porder/bySupplier?supplierid="+ grn.supplier_id.id ,"GET");
                fillCombo(cmbPOCode,"Select Porde Code", podersbysupplier,"pordercode",grn.porder_id.pordercode);

                cmbPOCode.disabled = true;
                cmbSRCode.disabled = true;
                srcodesbysupplier = httpRequest("../suppliierretun/listbysupplier?supplierid="+ grn.supplier_id.id ,"GET");
                fillCombo(cmbSRCode,"Select SR code", srcodesbysupplier,"supplierreturncode",grn.supplierreturn_id.supplierreturncode);
                txtReturnamount.value = parseFloat(grn.returnamount).toFixed(2);
            }
            if(JSON.parse(cmbGrnType.value).name == "Item Bill with return amount"){//pordecode and srcode visible
                cmbPOCode.disabled = true;
                cmbSRCode.disabled = true;
                podersbysupplier = httpRequest("../porder/bySupplier?supplierid="+ grn.supplier_id.id ,"GET");
                fillCombo(cmbPOCode,"Select Porde Code", podersbysupplier,"pordercode",grn.porder_id.pordercode);

                cmbPOCode.disabled = true;
                cmbSRCode.disabled = true;
                srcodesbysupplier = httpRequest("../suppliierretun/listbysupplier?supplierid="+ grn.supplier_id.id ,"GET");
                fillCombo(cmbSRCode,"Select SR code", srcodesbysupplier,"supplierreturncode",grn.supplierreturn_id.supplierreturncode);
                txtReturnamount.value = parseFloat(grn.returnamount).toFixed(2);
            }
            if (JSON.parse(cmbGrnType.value).name == "Return Only Bill"){//only sr code visible
                cmbPOCode.disabled = true;
                cmbSRCode.disabled = true;
                srcodesbysupplier = httpRequest("../suppliierretun/listbysupplier?supplierid="+ grn.supplier_id.id ,"GET");
                fillCombo(cmbSRCode,"Select SR code", srcodesbysupplier,"supplierreturncode",grn.supplierreturn_id.supplierreturncode);
                txtReturnamount.value = parseFloat(grn.returnamount).toFixed(2);
                grn.porder_id = null;
                fillCombo(cmbPOCode,"Select Porde Code", poders,"pordercode","");
            }

            //innerform
            //if drug
            if(grn.supplier_id.supplytype_id.name == "Drug"){
                fillCombo(cmbSupName,"Select Supplier Name", drugsuppliers,"fullname",grn.supplier_id.fullname);
                refreshInnerDrug();
                //fillCombo(cmbDrugItem, "Select Drug Item", subitems, "subitemname", grn.batch_id.item_id.name);
                //cmbSupType.disabled = false;
                innerDrug.style.display = "block";
                innerGrocery.style.display = "none";
                $('#collapseTwo').collapse('show')
            }
            //ig grocery
            else {
                fillCombo(cmbSupName,"Select Supplier Name", grocerysuppliers,"fullname",grn.supplier_id.fullname);
                refreshInnerGrocery();
                //cmbSupType.disabled = false;
                innerGrocery.style.display = "block";
                innerDrug.style.display = "none";
                $('#collapseFour').collapse('show')
            }

            fillCombo(cmbStatus,"",grnstatuses,"name",grn.grnstatus_id.name);
            cmbStatus.disabled = false;
            fillCombo(cmbAssignBy,"",employees,"callingname",grn.employee_id.callingname);

            disableButtons(true, false, false);
            setStyle(valid);
            changeTab('form');

            //  optional feild
            if(grn.description == null)
                txtDescription.style.border = initial;

            if(grn.porder_id == null)
                cmbPOCode.style.border = initial;

            if(grn.supplierreturn_id == null)
                cmbSRCode.style.border = initial;

            if(grn.returnamount == null)
                txtReturnamount.style.border = initial;
        }

        function getUpdates() {

            var updates = "";

            if(grn != null && oldgrn!=null) {

                if (grn.grncode != oldgrn.grncode)
                    updates = updates + "\nGRN Code is Changed " + oldgrn.grncode + " into " + grn.grncode;

                if (grn.supplier_id.supplytype_id.name != oldgrn.supplier_id.supplytype_id.name)
                    updates = updates + "\nSupplier Type is Changed " + oldgrn.supplier_id.supplytype_id.name + " into " + grn.supplier_id.supplytype_id.name;

                if (grn.supplier_id.fullname != oldgrn.fullname)
                    updates = updates + "\nSupplier Name is Changed " + oldgrn.supplier_id.fullname + " into " + grn.supplier_id.fullname;

                if (grn.receiveddate != oldgrn.receiveddate)
                    updates = updates + "\nReceive Date is Changed " + oldgrn.receiveddate + " into " + grn.receiveddate;

                if (grn.supplierbillno != oldgrn.supplierbillno)
                    updates = updates + "\nSuppllier Billno is Changed " + oldgrn.supplierbillno + " into " + grn.supplierbillno;

                if (grn.grandtotal != oldgrn.grandtotal)
                    updates = updates + "\nGrand Total is Changed " + oldgrn.grandtotal + " into " + grn.grandtotal;

                if (grn.discountratio != oldgrn.discountratio)
                    updates = updates + "\nDiscount Ration is Changed " + oldgrn.discountratio + " into " + grn.discountratio;

                if (grn.nettotal != oldgrn.nettotal)
                    updates = updates + "\nNet Total is Changed " + oldgrn.nettotal + " into " + grn.nettotal;

                if (grn.grntype_id.name != oldgrn.grntype_id.name)
                    updates = updates + "\nGRN Type is Changed " + oldgrn.grntype_id.name + " into " + grn.grntype_id.name;

                if (oldgrn.porder_id != null && grn.porder_id != null){
                    if (grn.porder_id.pordercode != oldgrn.porder_id.pordercode)
                        updates = updates + "\nPorder Code is Changed " + oldgrn.porder_id.pordercode + " into " + grn.porder_id.pordercode;
                }
                else if (grn.porder_id != null)
                    updates = updates + "\nPorder Code is Changed " + " to " + grn.porder_id.pordercode;

                if (oldgrn.supplierreturn_id != null && grn.supplierreturn_id != null){
                    if (grn.supplierreturn_id.supplierreturncode != oldgrn.supplierreturn_id.supplierreturncode)
                        updates = updates + "\nSR Code is Changed " + oldgrn.supplierreturn_id.supplierreturncode + " into " + grn.supplierreturn_id.supplierreturncode;
                }
                else if (grn.supplierreturn_id != null)
                    updates = updates + "\nSR Code is Changed " + " to " + grn.supplierreturn_id.supplierreturncode;


                if (grn.description != oldgrn.description)
                    updates = updates + "\nDescription is Changed " + oldgrn.description + " into " + grn.description;

                if (grn.grnstatus_id.name != oldgrn.grnstatus_id.name)
                    updates = updates + "\nGRN status is Changed " + oldgrn.grnstatus_id.name + " into " + grn.grnstatus_id.name;
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
                        title: "Are you sure to update following GRN details...?",
                        text: "\n"+ getUpdates(),
                        icon: "warning", buttons: true, dangerMode: true,
                    })
                        .then((willDelete) => {
                        if (willDelete) {
                            var response = httpRequest("/grn", "PUT", grn);
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

        function btnDeleteMC(gr) {
            grn = JSON.parse(JSON.stringify(gr));

            swal({
                title: "Are you sure to delete following GRN...?",
                text: "\nGRN Code : " + grn.grncode,
                icon: "warning", buttons: true, dangerMode: true,
            }).then((willDelete)=> {
                if (willDelete) {
                    var responce = httpRequest("/grn","DELETE",grn);
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

       function btnPrintTableMC(grn) {

            var newwindow = window.open();
            formattab = tblGrn.outerHTML;

           newwindow.document.write("" +
                "<html>" +
                "<head><style type='text/css'>.google-visualization-table-th {text-align: left;} .modifybutton{display: none} .isort{display: none}</style>" +
                "<link rel='stylesheet' href='../resources/bootstrap/css/bootstrap.min.css'/></head>" +
                "<body><div style='margin-top: 150px; '> <h1>GRN Details : </h1></div>" +
                "<div>"+ formattab+"</div>"+
               "</body>" +
                "</html>");
           setTimeout(function () {newwindow.print(); newwindow.close();},100) ;
        }

        function sortTable(cind) {
            cindex = cind;

         var cprop = tblGrn.firstChild.firstChild.children[cindex].getAttribute('property');

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