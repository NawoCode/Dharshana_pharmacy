

 

        window.addEventListener("load", initialize);

        //Initializing Functions

        function initialize() {

            //tooltip enable
            $('[data-toggle="tooltip"]').tooltip()

            // add / clear / update buttons Event Handler
            btnAdd.addEventListener("click",btnAddMC);
            btnClear.addEventListener("click",btnClearMC);
            btnUpdate.addEventListener("click",btnUpdateMC);

            //dteRequireDate.addEventListener("keyup",dteRequireDateKU);
            cmbSupName.addEventListener("change",cmbSupNameCH);

            cmbGroceryItem.addEventListener("change",cmbGroceryItemCH);
            cmbDrugItem.addEventListener("change",cmbDrugItemCH);

            txtSearchName.addEventListener("keyup",btnSearchMC);

            privilages = httpRequest("../privilage?module=QUOTATIONREQUEST","GET");
    
            suppliertypes = httpRequest("../itemtype/list","GET");
            drugsuppliers = httpRequest("../supplier/drugnamelist","GET");
            grocerysuppliers = httpRequest("../supplier/grocerynamelist","GET");
            qrstatuses = httpRequest("../quotationrequeststatus/list","GET");
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
            qrequests = new Array();
          var data = httpRequest("/quotationrequest/findAll?page="+page+"&size="+size+query,"GET");
            if(data.content!= undefined) qrequests = data.content;
            createPagination('pagination',data.totalPages, data.number+1,paginate);
            fillTable('tblQuotationRqst',qrequests,fillForm,btnDeleteMC,viewitem);
            clearSelection(tblQuotationRqst);

            if(activerowno!="")selectRow(tblQuotationRqst,activerowno,active);

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

        function viewitem(qr,rowno) {

            qrview = JSON.parse(JSON.stringify(qr));

            tdqrno.innerHTML = qrview.qrno;
            tdstype.innerHTML = qrview.supplier_id.supplytype_id.name;
            tdsname.innerHTML = qrview.supplier_id.fullname;
            tddtrequire.innerHTML = qrview.requiredate;

            if(qrview.supplier_id.supplytype_id.name == "Drug"){
                fillInnerTable("tblPrintInnerDrugItem",qrview.quotationrequestHasItemsList,innerModify, innerDelete, innerVeiw);
                $('#lblDrug').removeAttr("style");
                $('#tblDrug').removeAttr("style");
                $('#lblGrocery').css("display","none");
                $('#tblGrocery').css("display","none");

            }else{
                $('#lblDrug').css("display","none");
                $('#tblDrug').css("display","none");
                $('#lblGrocery').removeAttr("style");
                $('#tblGrocery').removeAttr("style");
                fillInnerTable("tblPrintInnerGroceryItem",qrview.quotationrequestHasItemsList,innerModify, innerDelete, innerVeiw);
            }

            tdasign.innerHTML = qrview.employee_id.callingname;
            tdaddate.innerHTML = qrview.addeddate;
            tdqstatus.innerHTML = qrview.qrstatus_id.name;
            tddesc.innerHTML = qrview.description;

            $('#dataVeiwModal').modal('show')


         }

         function btnPrintRowMC(){

             var format = printformtable.outerHTML;

             var newwindow=window.open();
             newwindow.document.write("<html>" +
                 "<head><style type='text/css'>.google-visualization-table-th {text-align: left;}</style>" +
                 "<link rel=\'stylesheet\' href=\'resources/bootstrap/css/bootstrap.min.css\'></head>" +
                 "<body><div style='margin-top: 150px'><h1 style='text-align: center'>Dharshana Pharmacy & Grocery</h1><h2>Quotation Request Details :</h2></div>" +
                 "<div>"+format+"</div>" +
                 "<script>printformtable.removeAttribute('style')</script>" +
                 "</body></html>");
             setTimeout(function () {newwindow.print(); newwindow.close();},100);
         }

         //require date type
         function dteRequireDateKU() {

             var d1 = new Date(dteRequireDate.value);
             var d2 = new Date(quotationrequest.addeddate);

             var today = new Date();
             var reqmonth = today.getMonth()+1 //[0-11]
             if(reqmonth<10) reqmonth = "0"+reqmonth;
             var reqdate = today.getDate(); //[0-31]
             if(reqdate<10) reqdate = "0"+reqdate;

             var requiredate = today.getFullYear()+ "-"+reqmonth+"-"+reqdate;

             if (requiredate != ""){
                 var regpattern = new RegExp('^[0-9]{4}[-][0-9]{2}[-][0-9]{2}$');
                 if (regpattern.test(requiredate)){

                     let afteroneweek = new Date();
                     afteroneweek.setDate(d2.getDate()+7);
                     let month = afteroneweek.getMonth()+1; //[0-11]
                     if (month < 10) month = "0" + month;
                     let day = afteroneweek.getDate(); //range[1-31]
                     if (day < 10) day = "0" + day;
                     var d3 = new Date(afteroneweek.getFullYear()+"-"+month+"-"+day);

                     if(parseInt(d2.getTime()) <= parseInt(d1.getTime()) && parseInt(d1.getTime()) <= parseInt(d3.getTime())){
                         console.log("In Range"+d2.getTime() +"<= "+d1.getTime()+" <="+ d3.getTime());
                         if(oldquotationrequest != null && oldquotationrequest.requiredate != dteRequireDate.value){
                             dteRequireDate.style.border = updated;
                             quotationrequest.requiredate = requiredate;
                         }
                         else{
                             dteRequireDate.style.border = valid;
                             quotationrequest.requiredate = requiredate;
                         }
                     }else {
                         console.log("Not in Range..." + d1);
                         dteRequireDate.style.border = invalid;
                     }
                 }else {
                     dteRequireDate.style.border = invalid;
                     console.log("Invalid pattern");
                 }
             }else {
                 dteRequireDate.style.border = invalid;
             }

         }

         //requiredate update
         function requiedateFill() {

            dteRequireDate.disabled = false;
            dteRequireDate.min = quotationrequest.addeddate;
            var d4 = new Date(quotationrequest.addeddate);
             console.log(d4);
            var today = new Date(getCurrentDateTime('date'));

             let afteroneweek = new Date(d4);
             afteroneweek.setDate(d4.getDate()+7);
             let month = afteroneweek.getMonth()+1; //[0-11]
             if (month < 10) month = "0" + month;
             let day = afteroneweek.getDate(); //range[1-31]
             if (day < 10) day = "0" + day;
             var d4max = new Date(afteroneweek.getFullYear()+"-"+month+"-"+day);
             //var d4max = new Date(maxAndMinDate('max',dteAddedDate,7));
             dteRequireDate.max = afteroneweek.getFullYear()+"-"+month+"-"+day;
             //dteRequireDate.max = maxAndMinDate('max',dteAddedDate,7);
             console.log(d4max);
             console.log(today);

              if(parseInt(today.getTime()) <= parseInt(d4max.getTime())){
                  if(oldquotationrequest != null && oldquotationrequest.requiredate != dteRequireDate.value){
                      dteRequireDate.style.border = updated;
                      dteRequireDate.disabled = false;
                  }
             }else {
                  dteRequireDate.disabled = true;
                 }
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
                if(oldquotationrequest != null && oldquotationrequest.supplier_id.supplytype_id.name != JSON.parse(cmbSupType.value).name){
                    cmbSupType.style.border = updated;
                    innerGrocery.style.display ="none";
                    innerDrug.style.display = "none";

                }else{
                    cmbSupType.style.border = valid;
                }
                cmbSupName.style.border = initial;
                quotationrequest.supplier_id = null;
                refreshInnerDrug();

            //grocery
            }else{
                fillCombo(cmbSupName,"Select Supplier Name", grocerysuppliers,"fullname","");

                cmbSupName.style.border = initial;
                quotationrequest.supplier_id = null;
                refreshInnerDrug();
            }

         }

        function subitemsBySupplierCH() {
            subitemsbysupplier = httpRequest("../subitem/listbysupplier?supplierid="+ JSON.parse(cmbSupName.value).id ,"GET");
            fillCombo(cmbDrugItem,"Select Drug Items", subitemsbysupplier,"subitemname","");
        }

        function itemsBySupplierCH() {
             itemsbysupplier = httpRequest("../item/listbysupplier?supplierid="+ JSON.parse(cmbSupName.value).id ,"GET");
             fillCombo(cmbGroceryItem,"Select Grocery Items", itemsbysupplier,"itemname","");
         }

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

        function cmbGroceryItemCH() {
            btnInnerGroceryAdd.disabled = false;
        }
        function cmbDrugItemCH() {
            btnInnerDrugAdd.disabled = false;
        }


        function loadForm() {
            quotationrequest = new Object();
            oldquotationrequest = null;

            //create new arra
            quotationrequest.quotationrequestHasItemsList = new Array();

            // fill data into combo
            // fillCombo(feildid, message, datalist, displayproperty, selected value)
             fillCombo(cmbSupType,"Select Supplier Type", suppliertypes,"name","");
             fillCombo(cmbSupName,"Select Supplier Name", drugsuppliers,"fullname","");
             cmbSupName.disabled = true;


             // fill and auto select / auto bind
             fillCombo(cmbQRStatus,"",qrstatuses,"name","Requested");
             fillCombo(cmbAssignBy,"",employees,"callingname",session.getObject('activeuser').employeeId.callingname);

            quotationrequest.qrstatus_id=JSON.parse(cmbQRStatus.value);
            cmbQRStatus.disabled = true;

            quotationrequest.employee_id=JSON.parse(cmbAssignBy.value);
            cmbAssignBy.disabled = true;

            dteAddedDate.value=getCurrentDateTime('date');
            quotationrequest.addeddate=dteAddedDate.value;
            dteAddedDate.disabled = true;

            // Get Next Number Form Data Base
            var nextNumber = httpRequest("/quotationrequest/nextnumber", "GET");
            txtQRNo.value = nextNumber.qrno;
            quotationrequest.qrno = txtQRNo.value;
            txtQRNo.disabled="disabled";

            //textfeild empty
            cmbSupName.value = "";
            cmbSupType.value = "";
            txtQRDescription.value = "";

            dteRequireDate.value = "";
            //set min date for require date
            dteRequireDate.min = getCurrentDateTime('date');
            //set max date for require date
            dteRequireDate.max = maxAndMinDate('max',dteAddedDate,7);

             setStyle(initial);

            txtQRNo.style.border=valid;
            dteAddedDate.style.border=valid;
            cmbQRStatus.style.border=valid;
            cmbAssignBy.style.border=valid;
            //txtSupRegNo.style.border=valid;

             disableButtons(false, true, true);

             refreshInnerDrug();
             refreshInnerGrocery();
            cmbSupName.disabled = true;

        }

        function setStyle(style) {
            txtQRNo.style.border = style;
            cmbSupName.style.border = style;
            cmbSupType.style.border = style;
            dteRequireDate.style.border = style;
            dteAddedDate.style.border = style;
            cmbQRStatus.style.border = style;
            cmbAssignBy.style.border = style;
            txtQRDescription.style.border = style;

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
            for(index in qrequests){
                if(qrequests[index].qrstatus_id.name =="Removed"){
                    tblQuotationRqst.children[1].children[index].style.color = "#f00";
                    tblQuotationRqst.children[1].children[index].style.border = "2px solid red";
                    tblQuotationRqst.children[1].children[index].lastChild.children[1].disabled = true;
                    tblQuotationRqst.children[1].children[index].lastChild.children[1].style.cursor = "not-allowed";

                }
            }

        }

        function refreshInnerDrug() {
            quotationrequestHasItem = new Object();
            oldquotationrequestHasItem = null;

            btnInnerDrugAdd.disabled = true;

            //auto fill combobox
            if (cmbSupName.value != ""){
                subitemsBySupplierCH();
            }else {
                fillCombo(cmbDrugItem, "Select Drug Item", subitems, "subitemname", "");
                //cmbDrugItem.disabled = true;
            }
            cmbDrugItem.style.border=initial;

            chRequestD.checked = false;
            $('#chRequestD').bootstrapToggle('off')
            quotationrequestHasItem.requested = false;
            quotationrequestHasItem.recieved = false;

            // Inner Table
            fillInnerTable("tblInnerDrug",quotationrequest.quotationrequestHasItemsList,innerModify, innerDelete, innerVeiw);
            if(quotationrequest.quotationrequestHasItemsList.length !=0){
                for (var index in quotationrequest.quotationrequestHasItemsList){
                    tblInnerDrug.children[1].children[index].lastChild.children[0].style.display= "none";
                }
                cmbSupType.disabled = true;
                cmbSupName.disabled = true;
            }else {
                cmbSupType.disabled = false;
                cmbSupName.disabled = false;
            }

        }

        function btnInnerAddDrugMc() {

            var itnext = false;
            for(var index in quotationrequest.quotationrequestHasItemsList){
                if (quotationrequest.quotationrequestHasItemsList[index].subitem_id.subitemname == quotationrequestHasItem.subitem_id.subitemname ){
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
                quotationrequest.quotationrequestHasItemsList.push(quotationrequestHasItem);
                refreshInnerDrug();
            }
        }

        function refreshInnerGrocery() {
            quotationrequestHasItem = new Object();
            oldquotationrequestHasItem = null;

            btnInnerGroceryAdd.disabled = true;

            //auto fill combobox
            if (cmbSupName.value != ""){
                itemsBySupplierCH();
            }else {
                fillCombo(cmbGroceryItem,"Select Grocery Item", items,"itemname","");
            }

            cmbGroceryItem.style.border=initial;

            chRequestG.checked = false;
            $('#chRequestG').bootstrapToggle('off')
            quotationrequestHasItem.requested = false;
            quotationrequestHasItem.recieved = false;

            // Inner Table
            fillInnerTable("tblInnerGrocery",quotationrequest.quotationrequestHasItemsList,innerModify, innerDelete, innerVeiw);
            if(quotationrequest.quotationrequestHasItemsList.length !=0){
                for (var index in quotationrequest.quotationrequestHasItemsList){
                    tblInnerGrocery.children[1].children[index].lastChild.children[0].style.display= "none";
                }
                cmbSupType.disabled = true;
                cmbSupName.disabled = true;
            }else {
                cmbSupType.disabled = false;
                cmbSupName.disabled = false;
            }
        }

        function btnInnerGroceryAddMc() {

            var itnext = false;
            for(var index in quotationrequest.quotationrequestHasItemsList){
                if (quotationrequest.quotationrequestHasItemsList[index].item_id.itemname == quotationrequestHasItem.item_id.itemname ){
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
                quotationrequest.quotationrequestHasItemsList.push(quotationrequestHasItem);
                refreshInnerGrocery();
            }
        }

        function btnInnerClearMc() {
            //inner drug clear
            if (JSON.parse(cmbSupType.value).name == "Drug"){
                if(quotationrequestHasItem.subitem_id != null){
                    swal({
                        title: "Are you sure to clear innerform?",
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
                if(quotationrequestHasItem.item_id != null){
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

        function innerModify() {}
        function innerDelete(innerob,innerrow) {
            if (JSON.parse(cmbSupType.value).name == "Drug"){
                swal({
                    title: "Are you sure to delete item?",
                    text: "\n" +
                        "Item Name : " + innerob.subitem_id.subitemname,
                    icon: "warning", buttons: true, dangerMode: true,
                }).then((willDelete) => {
                    if (willDelete) {
                        quotationrequest.quotationrequestHasItemsList.splice(innerrow,1);
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
                        quotationrequest.quotationrequestHasItemsList.splice(innerrow,1);
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
            else {addvalue = 1;}

            if (quotationrequest.supplier_id == null) {
                cmbSupName.style.border = invalid;
                errors = errors + "\n" + "Supplier Name Not Enter";
            }
            else {
                addvalue = 1;
                if (quotationrequest.quotationrequestHasItemsList.length == 0 ) {
                    if(JSON.parse(cmbSupType.value).name == "Grocery")
                        cmbGroceryItem.style.border = invalid;
                    else
                        cmbDrugItem.style.border = invalid;
                    errors = errors + "\n" + "Item Not Added";
                }
                else  addvalue = 1;
            }

            if (quotationrequest.requiredate == null) {
                dteRequireDate.style.border = invalid;
                errors = errors + "\n" + "Require Date Not Enter";
            }
            else  addvalue = 1;

            return errors;

        }

        function btnAddMC(){
            if(getErrors() == ""){
                if(txtQRDescription.value==""){
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
                title: "Are you sure to add following Quotation Request...?" ,
                  text :  "\nQRno : " + quotationrequest.qrno +
                    "\nSupplier Type : " + quotationrequest.supplier_id.supplytype_id.name +
                    "\nSupplier Name : " + quotationrequest.supplier_id.fullname +
                    "\nRequire Date : " + quotationrequest.requiredate +
                    "\nQuotation Request Status : " + quotationrequest.qrstatus_id.name,
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
                    var response = httpRequest("/quotationrequest", "POST", quotationrequest);
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

            if(oldquotationrequest == null && addvalue == ""){
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

        function fillForm(qr,rowno){
            activerowno = rowno;

            if (oldquotationrequest==null) {
                filldata(qr);
            } else {
                swal({
                    title: "Form has some values, updates values... Are you sure to discard the form ?",
                    text: "\n" ,
                    icon: "warning", buttons: true, dangerMode: true,
                }).then((willDelete) => {
                    if (willDelete) {
                        filldata(qr);
                    }

                });
            }

        }

        // Re fill data into form
        function filldata(qr) {
            clearSelection(tblQuotationRqst);
            selectRow(tblQuotationRqst,activerowno,active);

            quotationrequest = JSON.parse(JSON.stringify(qr));
            oldquotationrequest = JSON.parse(JSON.stringify(qr));

            txtQRNo.value = quotationrequest.qrno;
            txtQRNo.disabled="disabled";
            dteAddedDate.value = quotationrequest.addeddate;
            dteRequireDate.value = quotationrequest.requiredate;
            //requiedateFill();
            dateUpdateFill('max',dteRequireDate,'quotationrequest','validto','oldquotationrequest',7,'addeddate');

            fillCombo(cmbSupType,"Select Supplier Type", suppliertypes,"name",quotationrequest.supplier_id.supplytype_id.name);
            cmbSupType.disabled = false;

            //innerform
            if(quotationrequest.supplier_id.supplytype_id.name == "Drug"){
                fillCombo(cmbSupName,"Select Supplier Name", drugsuppliers,"fullname",quotationrequest.supplier_id.fullname);
                refreshInnerDrug();
                //cmbSupType.disabled = false;
                innerDrug.style.display = "block";
                innerGrocery.style.display = "none";
                $('#collapseTwo').collapse('show')
            }else {
                fillCombo(cmbSupName,"Select Supplier Name", grocerysuppliers,"fullname",quotationrequest.supplier_id.fullname);
                refreshInnerGrocery();
                //cmbSupType.disabled = false;
                innerGrocery.style.display = "block";
                innerDrug.style.display = "none";
                $('#collapseFour').collapse('show')
            }
            // fillCombo(cmbSupName,"Select Supplier Name", drugsuppliers,"name",quotationrequest.supplier_id.fullname);
            // fillCombo(cmbSupName,"Select Supplier Name", grocerysuppliers,"name",quotationrequest.supplier_id.fullname);

            fillCombo(cmbQRStatus,"",qrstatuses,"name",quotationrequest.qrstatus_id.name);
            cmbQRStatus.disabled = false;
            fillCombo(cmbAssignBy,"",employees,"callingname",quotationrequest.employee_id.callingname);

            // setDefaultFile('flePhoto', item.photo);

            disableButtons(true, false, false);
            setStyle(valid);
            changeTab('form');

            //  optional feild
            if(quotationrequest.description == null)
                txtQRDescription.style.border = initial;
        }

        function getUpdates() {

            var updates = "";

            if(quotationrequest!=null && oldquotationrequest!=null) {

                if (quotationrequest.qrno != oldquotationrequest.qrno)
                    updates = updates + "\nQRno is Changed " + oldquotationrequest.qrno + " into " + quotationrequest.qrno;

                if (quotationrequest.supplier_id.supplytype_id.name != oldquotationrequest.supplier_id.supplytype_id.name)
                    updates = updates + "\nSupplier Type is Changed " + oldquotationrequest.supplier_id.supplytype_id.name + " into " + quotationrequest.supplier_id.supplytype_id.name;

                if (quotationrequest.supplier_id.fullname != oldquotationrequest.supplier_id.fullname)
                    updates = updates + "\nSupplier Name is Changed " + oldquotationrequest.supplier_id.fullname + " into " + quotationrequest.supplier_id.fullname;

                if (quotationrequest.requiredate != oldquotationrequest.requiredate)
                    updates = updates + "\nRequire Date is Changed " + oldquotationrequest.requiredate + " into " + quotationrequest.requiredate;

                if (quotationrequest.description != oldquotationrequest.description)
                    updates = updates + "\nDescription is Changed " + oldquotationrequest.description + " into " + quotationrequest.description;

                if (quotationrequest.qrstatus_id.name != oldquotationrequest.qrstatus_id.name)
                    updates = updates + "\nQuotation Request status is Changed " + oldquotationrequest.qrstatus_id.name + " into " + quotationrequest.qrstatus_id.name;

                if(quotationrequest.supplier_id.supplytype_id.name=="Drug") {
                    if (isEqual(quotationrequest.quotationrequestHasItemsList, oldquotationrequest.quotationrequestHasItemsList, "subitem_id"))
                        updates = updates + "\nDrug Item is Changed ";
                }else {
                    if (isEqual(quotationrequest.quotationrequestHasItemsList, oldquotationrequest.quotationrequestHasItemsList, "item_id"))
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
                            var response = httpRequest("/quotationrequest", "PUT", quotationrequest);
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

        function btnDeleteMC(qr) {
            quotationrequest = JSON.parse(JSON.stringify(qr));

            swal({
                title: "Are you sure to delete following Quotation Request...?",
                text: "\nSupplier Regno : " + quotationrequest.qrno,
                icon: "warning", buttons: true, dangerMode: true,
            }).then((willDelete)=> {
                if (willDelete) {
                    var responce = httpRequest("/quotationrequest","DELETE",quotationrequest);
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
            formattab = tblQuotationRqst.outerHTML;

           newwindow.document.write("" +
                "<html>" +
                "<head><style type='text/css'>.google-visualization-table-th {text-align: left;} .modifybutton{display: none} .isort{display: none}</style>" +
                "<link rel='stylesheet' href='../resources/bootstrap/css/bootstrap.min.css'/></head>" +
                "<body><div style='margin-top: 150px; '> <h1>Quotation Request Details : </h1></div>" +
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