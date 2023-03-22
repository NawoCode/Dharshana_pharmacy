

 

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
            cmbSupName.addEventListener("change",cmbSupNameCH);
            //cmbQNo.addEventListener("change",cmbQNOCH);

            cmbDrugItem.addEventListener("change",cmbItemDrugCH);
            //cmbDrugItem.addEventListener("change",batchBySubitemCH);
            cmbGroceryItem.addEventListener("change",cmbGroceryItemCH);

            cmbDrugBatchno.addEventListener("change",cmbBatchDrugCH);
            cmbGroceryBatchno.addEventListener("change",cmbGroceryBatchCH);

            txtDrugQuantity.addEventListener("keyup",txtDrugQuantityCH);
            txtGrceryQuantity.addEventListener("keyup",txtGrceryQuantityCH);

            cmbDrugRetReas.addEventListener("change",cmbDrugRetReasCH);
            cmbGroceryRetReas.addEventListener("change",cmbGroceryRetReasCH);

            txtSearchName.addEventListener("keyup",btnSearchMC);

            privilages = httpRequest("../privilage?module=SUPPLIERRETURN","GET");

            suppliers = httpRequest("../supplier/supplierlist","GET");
            suppliertypes = httpRequest("../itemtype/list","GET");
            drugsuppliers = httpRequest("../supplier/drugnamelist","GET");
            grocerysuppliers = httpRequest("../supplier/grocerynamelist","GET");
            batches = httpRequest("../batch/list","GET");
            srstatuses = httpRequest("../srstatus/list","GET");
            employees = httpRequest("../employee/list","GET");
            returnreasons = httpRequest("../returnreason/list","GET");

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
            supplierreturns = new Array();
          var data = httpRequest("/suppliierretun/findAll?page="+page+"&size="+size+query,"GET");
            if(data.content!= undefined) supplierreturns = data.content;
            createPagination('pagination',data.totalPages, data.number+1,paginate);
            fillTable('tblSupReturn',supplierreturns,fillForm,btnDeleteMC,viewitem);
            clearSelection(tblSupReturn);

            if(activerowno!="")selectRow(tblSupReturn,activerowno,active);

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

        function viewitem(supr,rowno) {

            suprview = JSON.parse(JSON.stringify(supr));

            tdsrcode.innerHTML = suprview.supplierreturncode;
            tdstype.innerHTML = suprview.supplier_id.supplytype_id.name;
            tdsname.innerHTML = suprview.supplier_id.fullname;
            tddtRetDt.innerHTML = suprview.returndate;
            tddtTotlAmount.innerHTML = parseFloat(suprview.totalamount).toFixed(2);

            if(suprview.supplier_id.supplytype_id.name == "Drug"){
                fillInnerTable("tblPrintInnerDrugItem",suprview.supplierReturnHasItemsList,innerModify, innerDelete, innerVeiw);
                $('#lblDrug').removeAttr("style");
                $('#tblDrug').removeAttr("style");
                $('#lblGrocery').css("display","none");
                $('#tblGrocery').css("display","none");

            }else{
                $('#lblDrug').css("display","none");
                $('#tblDrug').css("display","none");
                $('#lblGrocery').removeAttr("style");
                $('#tblGrocery').removeAttr("style");
                fillInnerTable("tblPrintInnerGroceryItem",suprview.supplierReturnHasItemsList,innerModify, innerDelete, innerVeiw);
            }

            tdasign.innerHTML = suprview.employee_id.callingname;
            tdaddate.innerHTML = suprview.addeddate;
            tdsrstatus.innerHTML = suprview.srstatus_id.name;
            tddesc.innerHTML = suprview.description;

            $('#dataVeiwModal').modal('show')

         }

         function btnPrintRowMC(){

             var format = printformtable.outerHTML;

             var newwindow=window.open();
             newwindow.document.write("<html>" +
                 "<head><style type='text/css'>.google-visualization-table-th {text-align: left;}</style>" +
                 "<link rel=\'stylesheet\' href=\'resources/bootstrap/css/bootstrap.min.css\'></head>" +
                 "<body><div style='margin-top: 150px'><h1 style='text-align: center'>Dharshana Pharmacy & Grocery</h1><h2>Supplier Return Details :</h2></div>" +
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
                if(oldsupreturn != null && oldsupreturn.supplier_id.supplytype_id.name != JSON.parse(cmbSupType.value).name){
                    cmbSupType.style.border = updated;
                    innerGrocery.style.display ="none";
                    innerDrug.style.display = "none";

                }else{
                    cmbSupType.style.border = valid;
                }
                cmbSupName.style.border = initial;
                supreturn.supplier_id = null;
                refreshInnerDrug();

                //grocery
            }else{
                fillCombo(cmbSupName,"Select Supplier Name", grocerysuppliers,"fullname","");

                cmbSupName.style.border = initial;
                supreturn.supplier_id = "";
                refreshInnerGrocery();
            }

        }

        // change inner sub item by given supplier
        function subitemsBySupplierCH() {
            subitemsbysupplier = httpRequest("../subitem/listbysupplier?supplierid="+ JSON.parse(cmbSupName.value).id ,"GET");
            fillCombo(cmbDrugItem,"Select Drug Items", subitemsbysupplier,"subitemname","");
        }

        // change inner item by given supplier
        function itemsBySupplierCH() {
            itemsbysupplier = httpRequest("../item/listbysupplier?supplierid="+ JSON.parse(cmbSupName.value).id ,"GET");
            fillCombo(cmbGroceryItem,"Select Grocery Items", itemsbysupplier,"itemname","");
        }

        //visible inner form when select supplier name
        function cmbSupNameCH() {
            if(JSON.parse(cmbSupType.value).name == "Drug"){
                innerDrug.style.display = "block";
                innerGrocery.style.display ="none";
                refreshInnerDrug();
                subitemsBySupplierCH();

            }else {
                innerDrug.style.display = "none";
                innerGrocery.style.display = "block";
                refreshInnerGrocery();
                itemsBySupplierCH();

            }
        }

        //change batch no by given drugitem id
        function cmbItemDrugCH() {
            console.log(JSON.parse(cmbDrugItem.value))
            batcesbyitem = httpRequest("../batch/batchnolist?itemid="+JSON.parse(cmbDrugItem.value).item_id.id,"GET");
            fillCombo(cmbDrugBatchno,"Select Batch No",batcesbyitem,"batchno","");
            cmbDrugBatchno.disabled = false;

            //item drug item changed
            if(oldsupreturnHasItem != null && oldsupreturnHasItem.subitem_id.subitemname != JSON.parse(cmbDrugItem.value).subitemname){
                cmbDrugItem.style.border = updated;
            }
            else{
                cmbDrugItem.style.border = valid;
            }
            txtDrugQuantity.style.border=initial;
            cmbDrugBatchno.style.border=initial;

            txtDrugPurchasePrice.value = "0.00";
            txtDrugQuantity.value = "";
            txtDrugLineTotal.value = "0.00";

            supreturnHasItem.batch_id = "";
            supreturnHasItem.purchaseprice = "";
            supreturnHasItem.qty = "";
            supreturnHasItem.linetotal = "";
        }
        //auto load purrchase price by given batch no for drug inner
        function cmbBatchDrugCH() {
            txtDrugPurchasePrice.value = parseFloat(JSON.parse(cmbDrugBatchno.value).purchaseprice).toFixed(2);
            supreturnHasItem.purchaseprice = txtDrugPurchasePrice.value;
            txtDrugQuantity.disabled=false;

            //if batch no changed
            if(oldsupreturnHasItem != null && oldsupreturnHasItem.batch_id.batchno != JSON.parse(cmbDrugBatchno.value).batchno){
                cmbDrugBatchno.style.border = updated;
            }
            else{
                cmbDrugBatchno.style.border = valid;
            }
            txtDrugQuantity.style.border=initial;

            txtDrugQuantity.value = "";
            txtDrugLineTotal.value = "0.00";

            supreturnHasItem.qty = "";
            supreturnHasItem.linetotal = "";
        }

        //change batch no by given groceryitem id
        function cmbGroceryItemCH() {
            batcesbygitem = httpRequest("../batch/batchnolist?itemid="+JSON.parse(cmbGroceryItem.value).id,"GET");
            fillCombo(cmbGroceryBatchno,"Select Batch No",batcesbygitem,"batchno","");
            cmbGroceryBatchno.disabled = false;

            //if grocery item changed
            if(oldsupreturnHasItem != null && oldsupreturnHasItem.item_id.itemname != JSON.parse(cmbGroceryItem.value).itemname){
                cmbGroceryItem.style.border = updated;
            }
            else{
                cmbGroceryItem.style.border = valid;
            }
            txtGrceryQuantity.style.border=initial;
            cmbGroceryBatchno.style.border=initial;

            txtGroceryPurchasPrice.value = "0.00";
            txtGrceryQuantity.value = "";
            txtGroceryLineTotal.value = "0.00";

            supreturnHasItem.batch_id = "";
            supreturnHasItem.purchaseprice = "";
            supreturnHasItem.qty = "";
            supreturnHasItem.linetotal = "";
        }
        //auto load purrchase price by given batch no for grcery inner
        function cmbGroceryBatchCH() {
            txtGroceryPurchasPrice.value = parseFloat(JSON.parse(cmbGroceryBatchno.value).purchaseprice).toFixed(2);
            supreturnHasItem.purchaseprice = txtGroceryPurchasPrice.value;
            txtGrceryQuantity.disabled=false;

            //if batchno changed
            if(oldsupreturnHasItem != null && oldsupreturnHasItem.batch_id.batchno != JSON.parse(cmbGroceryBatchno.value).batchno){
                cmbGroceryBatchno.style.border = updated;
            }
            else{
                cmbGroceryBatchno.style.border = valid;
            }
            txtGrceryQuantity.style.border=initial;

            txtGrceryQuantity.value = "";
            txtGroceryLineTotal.value = "0.00";

            supreturnHasItem.qty = "";
            supreturnHasItem.linetotal = "";
        }

        //calculate line total in drug inner
        function txtDrugQuantityCH() {

            var val = txtDrugQuantity.value.trim();
            if (val != ""){
                var regpattern = new RegExp('^[0-9]{1,3}$');
                if (regpattern.test(val)){
                    if(oldsupreturnHasItem != null && oldsupreturnHasItem.qty != txtDrugQuantity.value){
                        txtDrugQuantity.style.border = updated;
                        btnInnerDrugUpdate.disabled = false;
                    }else {
                        txtDrugQuantity.style.border = valid;
                    }
                    cmbDrugRetReas.disabled = false;
                    txtDrugLineTotal.value = (parseFloat(txtDrugPurchasePrice.value) * parseFloat(txtDrugQuantity.value)).toFixed(2);
                    //txtDrugLineTotal.style.border = valid;
                    supreturnHasItem.linetotal = txtDrugLineTotal.value;
                }else {cmbDrugRetReas.disabled = true;}
            }else {cmbDrugRetReas.disabled = true;}


        }
        //inneradd enable when
        function cmbDrugRetReasCH() {
            if(oldsupreturnHasItem != null && oldsupreturnHasItem.returnreason_id != JSON.parse(cmbDrugRetReas.value)){
                cmbDrugRetReas.style.border = updated;
                btnInnerDrugAdd.disabled = true;
                btnInnerDrugUpdate.disabled = false;
            }
            else{
                cmbDrugRetReas.style.border = valid;
                btnInnerDrugAdd.disabled = false;
                btnInnerDrugUpdate.disabled = true;
            }
        }

        //calculate line total in grocery inner
        function txtGrceryQuantityCH() {
            var val = txtGrceryQuantity.value.trim();
            if (val != ""){
                var regpattern = new RegExp('^[0-9]{1,3}$');
                if (regpattern.test(val)){
                    if(oldsupreturnHasItem != null && oldsupreturnHasItem.qty != txtGrceryQuantity.value){
                        txtGrceryQuantity.style.border = updated;
                        btnInnerGroceryUpdate.disabled = false;
                    }else {
                        txtDrugQuantity.style.border = valid;
                    }
                    cmbGroceryRetReas.disabled = false;
                    txtGroceryLineTotal.value = (parseFloat(txtGroceryPurchasPrice.value) * parseFloat(txtGrceryQuantity.value)).toFixed(2);
                    //txtDrugLineTotal.style.border = valid;
                    supreturnHasItem.linetotal = txtGroceryLineTotal.value;
                }else {cmbGroceryRetReas.disabled = true;}
            }else {cmbGroceryRetReas.disabled = true;}


        }
        //inneradd enable when
        function cmbGroceryRetReasCH() {
            if(oldsupreturnHasItem != null && oldsupreturnHasItem.returnreason_id != JSON.parse(cmbGroceryRetReas.value)){
                cmbGroceryRetReas.style.border = updated;
                btnInnerGroceryAdd.disabled = true;
                btnInnerGroceryUpdate.disabled = false;
            }
            else{
                cmbGroceryRetReas.style.border = valid;
                btnInnerGroceryAdd.disabled = false;
                btnInnerGroceryUpdate.disabled = true;
            }
        }

        function loadForm() {
            innerGrocery.style.display ="none";
            innerDrug.style.display = "none";

            supreturn = new Object();
            oldsupreturn = null;

            //create new array
            supreturn.supplierReturnHasItemsList = new Array();

            // fill data into combo
            // fillCombo(feildid, message, datalist, displayproperty, selected value)
            fillCombo(cmbSupType,"Select Supplier Type", suppliertypes,"name","");
            fillCombo(cmbSupName,"Select Supplier Name", suppliers,"fullname","");
            cmbSupName.disabled = true;

             // fill and auto select / auto bind
             fillCombo(cmbStatus,"",srstatuses,"name","Requested");
             fillCombo(cmbAssignBy,"",employees,"callingname",session.getObject('activeuser').employeeId.callingname);

            supreturn.srstatus_id=JSON.parse(cmbStatus.value);
            cmbStatus.disabled = true;

            supreturn.employee_id=JSON.parse(cmbAssignBy.value);
            cmbAssignBy.disabled = true;

            dteAddedDate.value=getCurrentDateTime('date');;
            supreturn.addeddate=dteAddedDate.value;
            dteAddedDate.disabled = true;

            // Get Next Number Form Data Base
            var nextNumber = httpRequest("/suppliierretun/nextnumber", "GET");
            txtSRCode.value = nextNumber.supplierreturncode;
            supreturn.supplierreturncode = txtSRCode.value;
            txtSRCode.disabled= true;

            //textfeild empty
            cmbSupName.value = "";

            cmbSupName.value = "";
            cmbSupType.value = "";
            txtTotalAmount.value = "";
            dteRetuenDate.value = "";
            txtDescription.value = "";


            dteRetuenDate.value = "";
            //set min date for require date
            dteRetuenDate.min = getCurrentDateTime('date');
            //set max date for require date
            dteRetuenDate.max = maxAndMinDate('max',dteAddedDate,7);;

            txtTotalAmount.disabled = true;

             setStyle(initial);

            txtSRCode.style.border=valid;
            dteAddedDate.style.border=valid;
            cmbStatus.style.border=valid;
            cmbAssignBy.style.border=valid;

             disableButtons(false, true, true);

             refreshInnerDrug();
             refreshInnerGrocery();
            cmbSupName.disabled = true;

        }

        function setStyle(style) {

            txtSRCode.style.border = style;
            cmbSupType.style.border = style;
            cmbSupName.style.border = style;
            txtTotalAmount.style.border = style;
            dteRetuenDate.style.border = style;
            txtDescription.style.border = style;
            dteAddedDate.style.border = style;
            cmbStatus.style.border = style;
            cmbAssignBy.style.border = style;
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
            for(index in supplierreturns){
                if(supplierreturns[index].srstatus_id.name =="Removed"){
                    tblSupReturn.children[1].children[index].style.color = "#f00";
                    tblSupReturn.children[1].children[index].style.border = "2px solid red";
                    tblSupReturn.children[1].children[index].lastChild.children[1].disabled = true;
                    tblSupReturn.children[1].children[index].lastChild.children[1].style.cursor = "not-allowed";

                }
            }

        }

        function refreshInnerDrug() {
            supreturnHasItem = new Object();
            oldsupreturnHasItem = null;

            btnInnerDrugAdd.disabled = true;
            btnInnerDrugUpdate.disabled = true;

            totalAmount= 0;

            //drug item fill
            if(cmbSupName.value != ""){
                subitemsBySupplierCH();
            }else {
                fillCombo(cmbDrugItem, "Select Drug Item", subitems, "subitemname", "");
                //cmbDrugItem.disabled = true;
            }
            //baatch no fill by given item
            if(cmbDrugItem.value != ""){
                cmbItemDrugCH();
            }else {
                fillCombo(cmbDrugBatchno,"Select Batch No", batches,"batchno","");
                cmbDrugBatchno.disabled = true;
            }

            cmbDrugItem.style.border=initial;
            cmbDrugBatchno.style.border=initial;
            txtDrugQuantity.style.border=initial;
            cmbDrugRetReas.style.border=initial;

            txtDrugPurchasePrice.value = "0.00";
            txtDrugQuantity.value = "0";
            txtDrugLineTotal.value = "0.00";

            txtDrugQuantity.disabled=true;

            fillCombo(cmbDrugRetReas, "Select Return Reason",returnreasons, "name", "");
            cmbDrugRetReas.disabled = true;

            // Inner Table
            fillInnerTable("tblInnerDrug",supreturn.supplierReturnHasItemsList,innerModify, innerDelete, true);
            if(supreturn.supplierReturnHasItemsList.length != 0){
                for (var index in supreturn.supplierReturnHasItemsList){
                    //tblInnerDrug.children[1].children[index].lastChild.children[0].style.display= "none";
                    totalAmount = (parseFloat(totalAmount) + parseFloat(supreturn.supplierReturnHasItemsList[index].linetotal)).toFixed(2);
                }
                txtTotalAmount.value = totalAmount;
                supreturn.totalamount = txtTotalAmount.value;
                if(oldsupreturn != null && supreturn.totalamount != oldsupreturn.totalamount){
                    txtTotalAmount.style.border=updated;
                }else{
                    txtTotalAmount.style.border=valid   ;
                }

                cmbSupType.disabled = true;
                cmbSupName.disabled = true;
            }else {
                totalAmount = null;
                txtTotalAmount.value = totalAmount;
                // porder.totalamount = txtTotalAmount.value;
                supreturn.totalamount = "";
                //txtTotalAmount.style.border = invalid;

                cmbSupType.disabled = false;
                cmbSupName.disabled = false;
            }

        }

        function btnInnerAddDrugMc() {

            var itnext = false;
            for(var index in supreturn.supplierReturnHasItemsList){
                if (supreturn.supplierReturnHasItemsList[index].subitem_id.subitemname == supreturnHasItem.subitem_id.subitemname ){
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
                supreturn.supplierReturnHasItemsList.push(supreturnHasItem);
                refreshInnerDrug();

            }
        }

        function refreshInnerGrocery() {
            supreturnHasItem = new Object();
            oldsupreturnHasItem = null;

            totalAmount = 0;

            btnInnerGroceryAdd.disabled = true;
            btnInnerGroceryUpdate.disabled = true;

            //auto fill combobox
            if (cmbSupName.value != ""){
                itemsBySupplierCH();
            }else {
                fillCombo(cmbGroceryItem,"Select Grocery Item",items,"itemname","");
            }

            if(cmbGroceryItem.value != ""){
                cmbGroceryItemCH();
            }else {
                fillCombo(cmbGroceryBatchno,"Select Batch No",batches,"batchno","");
                cmbGroceryBatchno.disabled = true;
            }

            cmbGroceryItem.style.border=initial;
            cmbGroceryBatchno.style.border=initial;
            txtGrceryQuantity.style.border=initial;
            cmbGroceryRetReas.style.border=initial;

            txtGroceryPurchasPrice.value = "0.00";
            txtGrceryQuantity.value = "";
            txtGroceryLineTotal.value = "0.00";

            txtGrceryQuantity.disabled=true;

            fillCombo(cmbGroceryRetReas, "Select Return Reason",returnreasons, "name", "");
            cmbGroceryRetReas.disabled=true;

            // Inner Table
            fillInnerTable("tblInnerGrocery",supreturn.supplierReturnHasItemsList,innerModify, innerDelete, true);
            if(supreturn.supplierReturnHasItemsList.length != 0){
                for (var index in supreturn.supplierReturnHasItemsList){
                    //tblInnerGrocery.children[1].children[index].lastChild.children[0].style.display= "none";
                    totalAmount = (parseFloat(totalAmount) + parseFloat(supreturn.supplierReturnHasItemsList[index].linetotal)).toFixed(2);
                }
                txtTotalAmount.value = totalAmount;
                supreturn.totalamount = txtTotalAmount.value;
                if(oldsupreturn != null && supreturn.totalamount != oldsupreturn.totalamount){
                    txtTotalAmount.style.border=updated;
                }else{
                    txtTotalAmount.style.border=valid   ;
                }

                cmbSupType.disabled = true;
                cmbSupName.disabled = true;
            }else {
                totalAmount = null;
                txtTotalAmount.value = totalAmount;
                // porder.totalamount = txtTotalAmount.value;
                supreturn.totalamount = "";
                //txtTotalAmount.style.border = invalid;

                cmbSupType.disabled = false;
                cmbSupName.disabled = false;
            }
        }

        function btnInnerGroceryAddMc() {

            var itnext = false;
            for(var index in supreturn.supplierReturnHasItemsList){
                if (supreturn.supplierReturnHasItemsList[index].item_id.itemname == supreturnHasItem.item_id.itemname ){
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
                supreturn.supplierReturnHasItemsList.push(supreturnHasItem);
                refreshInnerGrocery();

            }
        }

        function btnInnerClearMc() {
            //inner drug clear
            if (JSON.parse(cmbSupType.value).name == "Drug"){
                if(supreturnHasItem.subitem_id != null){
                    swal({
                        title: "Are you sure to cler innerform?",
                        text: "\n",
                        icon: "warning", buttons: true, dangerMode: true,
                    }).then((willDelete) => {
                        if (willDelete) {
                            refreshInnerDrug();
                            cmbDrugItem.disabled = false;
                        }
                    });
                }else {
                    refreshInnerDrug();
                    cmbDrugItem.disabled = false;
                }
            }
            //inner grocerry clear
            else {
                if(supreturnHasItem.item_id != null){
                    swal({
                        title: "Are you sure to cler innerform?",
                        text: "\n",
                        icon: "warning", buttons: true, dangerMode: true,
                    }).then((willDelete) => {
                        if (willDelete) {
                            refreshInnerGrocery();
                            cmbGroceryItem.disabled = false;
                        }
                    });
                }else {
                    refreshInnerGrocery();
                    cmbGroceryItem.disabled = false;
                }
            }
            
        }
        
        function innerModify(ob, innerrowno) {
            innerrow = innerrowno;

            supreturnHasItem = JSON.parse(JSON.stringify(ob));
            oldsupreturnHasItem = JSON.parse(JSON.stringify(ob));

            //inner drug fill
            if (JSON.parse(cmbSupType.value).name == "Drug") {
                $('#collapseOne').collapse('show')
                btnInnerDrugUpdate.disabled = true;
                btnInnerDrugAdd.disabled = true;

                fillCombo(cmbDrugItem, "Select Drug Item", subitemsbysupplier, "subitemname", supreturnHasItem.subitem_id.subitemname );
                cmbDrugItem.disabled = true;
                batcesbyitem = httpRequest("../batch/batchnolist?itemid="+JSON.parse(cmbDrugItem.value).id,"GET");
                fillCombo(cmbDrugBatchno,"Select Batch No",batcesbyitem,"batchno",supreturnHasItem.batch_id.batchno);
                txtDrugPurchasePrice.value = parseFloat(supreturnHasItem.purchaseprice).toFixed(2);
                txtDrugQuantity.value = supreturnHasItem.qty;
                txtDrugQuantity.style.border = valid;
                txtDrugQuantity.disabled = false;
                txtDrugLineTotal.value = parseFloat(supreturnHasItem.linetotal).toFixed(2);
                fillCombo(cmbDrugRetReas, "Select Return Reason",returnreasons, "name", supreturnHasItem.returnreason_id.name);
                cmbDrugRetReas.disabled = false;
            }else{
                $('#collapseThree').collapse('show')
                btnInnerGroceryUpdate.disabled = true;
                btnInnerGroceryAdd.disabled = true;

                fillCombo(cmbGroceryItem,"Select Grocery Item", items,"itemname",supreturnHasItem.item_id.itemname);
                cmbGroceryItem.disabled = true;
                batcesbygitem = httpRequest("../batch/batchnolist?itemid="+JSON.parse(cmbGroceryItem.value).id,"GET");
                fillCombo(cmbGroceryBatchno,"Select Batch No",batcesbygitem,"batchno",supreturnHasItem.batch_id.batchno);
                txtGroceryPurchasPrice.value = parseFloat(supreturnHasItem.purchaseprice).toFixed(2);
                txtGrceryQuantity.value = supreturnHasItem.qty;
                txtGrceryQuantity.style.border = valid;
                txtGrceryQuantity.disabled = false;
                txtGroceryLineTotal.value = parseFloat(supreturnHasItem.linetotal).toFixed(2);
                fillCombo(cmbGroceryRetReas, "Select Return Reason",returnreasons, "name", supreturnHasItem.returnreason_id.name);
                cmbGroceryRetReas.disabled = false;
            }

        }

        function btnInnerUpdateMc(){
            supreturn.supplierReturnHasItemsList[innerrow] = supreturnHasItem;
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
                        supreturn.supplierReturnHasItemsList.splice(innerrow,1);
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
                        supreturn.supplierReturnHasItemsList.splice(innerrow,1);
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

            if (supreturn.supplier_id == null) {
                cmbSupName.style.border = invalid;
                errors = errors + "\n" + "Supplier Name Not Enter";
            }
            else {
                addvalue = 1;
                if (supreturn.supplierReturnHasItemsList.length == 0 ) {
                    if(JSON.parse(cmbSupType.value).name == "Grocery")
                        cmbGroceryItem.style.border = invalid;
                    else
                        cmbDrugItem.style.border = invalid;
                    errors = errors + "\n" + "Item And Other details Not Added";
                }
                else  addvalue = 1;
            }

            if (supreturn.returndate == null) {
                dteRetuenDate.style.border = invalid;
                errors = errors + "\n" + "Required Date Not Entered";
            }
            else  addvalue = 1;

            if (supreturn.totalamount == null) {
                txtTotalAmount.style.border = invalid;
                errors = errors + "\n" + "Total Amount Not Enter";
            }
            else  addvalue = 1;

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

            swal({
                title: "Are you sure to add following Supplier Return...?" ,
                  text :  "\nSR Code : " + supreturn.supplierreturncode +
                    "\nSupplier Type : " + supreturn.supplier_id.supplytype_id.name +
                    "\nSupplier Name : " + supreturn.supplier_id.fullname +
                    "\nReturn Date : " + supreturn.returndate +
                    "\nTotal Amount : " + supreturn.totalamount +
                    "\nsupreturn Status : " + supreturn.srstatus_id.name,
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
                    var response = httpRequest("/suppliierretun", "POST", supreturn);
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

            if(supreturn == null && addvalue == ""){
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

        function fillForm(supr,rowno){
            activerowno = rowno;

            if (oldsupreturn==null) {
                filldata(supr);
            } else {
                swal({
                    title: "Form has some values, updates values... Are you sure to discard the form ?",
                    text: "\n" ,
                    icon: "warning", buttons: true, dangerMode: true,
                }).then((willDelete) => {
                    if (willDelete) {
                        filldata(supr);
                    }

                });
            }

        }

        // Re fill data into form
        function filldata(supr) {
            clearSelection(tblSupReturn);
            selectRow(tblSupReturn,activerowno,active);

            supreturn = JSON.parse(JSON.stringify(supr));
            oldsupreturn = JSON.parse(JSON.stringify(supr));

            txtSRCode.value = supreturn.supplierreturncode;
            txtSRCode.disabled="disabled";
            dteRetuenDate.value = supreturn.returndate;
            dateUpdateFill('max',dteRetuenDate,'supreturn','returndate','oldsupreturn',7,'addeddate');
            txtTotalAmount.value = supreturn.totalamount;
            dteAddedDate.value = supreturn.addeddate;
            txtDescription.value = supreturn.description;

            fillCombo(cmbSupType,"Select Supplier Type", suppliertypes,"name",supreturn.supplier_id.supplytype_id.name);
            cmbSupType.disabled = false;

            //innerform
            //if drug
            if(supr.supplier_id.supplytype_id.name == "Drug"){
                fillCombo(cmbSupName,"Select Supplier Name", drugsuppliers,"fullname",supreturn.supplier_id.fullname);
                refreshInnerDrug();
                //cmbSupType.disabled = false;
                innerDrug.style.display = "block";
                innerGrocery.style.display = "none";
                $('#collapseTwo').collapse('show')
            }
            //ig grocery
            else {
                fillCombo(cmbSupName,"Select Supplier Name", grocerysuppliers,"fullname",supreturn.supplier_id.fullname);
                refreshInnerGrocery();
                //cmbSupType.disabled = false;
                innerGrocery.style.display = "block";
                innerDrug.style.display = "none";
                $('#collapseFour').collapse('show')
            }

            fillCombo(cmbStatus,"",srstatuses,"name",supreturn.srstatus_id.name);
            cmbStatus.disabled = false;
            fillCombo(cmbAssignBy,"",employees,"callingname",supreturn.employee_id.callingname);

            disableButtons(true, false, false);
            setStyle(valid);
            changeTab('form');

            //optional feild
            if(supreturn.description == null)
                txtDescription.style.border = initial;
        }

        function getUpdates() {

            var updates = "";

            if(supreturn!=null && oldsupreturn!=null) {

                if (supreturn.supplierreturncode != oldsupreturn.supplierreturncode)
                    updates = updates + "\nSR Code is Changed " + oldsupreturn.supplierreturncode + " into " + supreturn.supplierreturncode;

                if (supreturn.supplier_id.supplytype_id.name != oldsupreturn.supplier_id.supplytype_id.name)
                    updates = updates + "\nSupplier Type is Changed " + oldsupreturn.supplier_id.supplytype_id.name + " into " + supreturn.supplier_id.supplytype_id.name;

                if (supreturn.supplier_id.fullname != oldsupreturn.fullname)
                    updates = updates + "\nSupplier Name is Changed " + oldsupreturn.supplier_id.fullname + " into " + supreturn.supplier_id.fullname;

                if (supreturn.returndate != oldsupreturn.returndate)
                    updates = updates + "\nReturn Date is Changed " + oldsupreturn.returndate + " into " + supreturn.returndate;

                if (supreturn.totalamount != oldsupreturn.totalamount)
                    updates = updates + "\nTotal Amount is Changed " + oldsupreturn.totalamount + " into " + supreturn.totalamount;

                if (supreturn.description != oldsupreturn.description)
                    updates = updates + "\nDescription is Changed " + oldsupreturn.description + " into " + supreturn.description;

                if (supreturn.srstatus_id.name != oldsupreturn.srstatus_id.name)
                    updates = updates + "\nPorder status is Changed " + oldsupreturn.srstatus_id.name + " into " + supreturn.srstatus_id.name;
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
                        title: "Are you sure to update following Supllier Return details...?",
                        text: "\n"+ getUpdates(),
                        icon: "warning", buttons: true, dangerMode: true,
                    })
                        .then((willDelete) => {
                        if (willDelete) {
                            var response = httpRequest("/suppliierretun", "PUT", supreturn);
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

        function btnDeleteMC(supr) {
            supreturn = JSON.parse(JSON.stringify(supr));

            swal({
                title: "Are you sure to delete following Supplier Return...?",
                text: "\nSR Code : " + supreturn.supplierreturncode,
                icon: "warning", buttons: true, dangerMode: true,
            }).then((willDelete)=> {
                if (willDelete) {
                    var responce = httpRequest("/suppliierretun","DELETE",supreturn);
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
                }loadForm();
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
            formattab = tblPorder.outerHTML;

           newwindow.document.write("" +
                "<html>" +
                "<head><style type='text/css'>.google-visualization-table-th {text-align: left;} .modifybutton{display: none} .isort{display: none}</style>" +
                "<link rel='stylesheet' href='../resources/bootstrap/css/bootstrap.min.css'/></head>" +
                "<body><div style='margin-top: 150px; '> <h1>Purchase Order Details : </h1></div>" +
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