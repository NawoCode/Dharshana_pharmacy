

 

        window.addEventListener("load", initialize);

        //Initializing Functions

        function initialize() {

            //tooltip enable
            $('[data-toggle="tooltip"]').tooltip()

            // add / clear / update buttons Event Handler
            btnAdd.addEventListener("click",btnAddMC);
            btnClear.addEventListener("click",btnClearMC);
            btnUpdate.addEventListener("click",btnUpdateMC);
            cmbSupType.addEventListener("change",cmbSTypeCH);
            //cmbUnit.addEventListener("change",cmbUnitCH);

            cmbGroceryItem.addEventListener("change",cmbGroceryItemCH);
            cmbDrugItem.addEventListener("change",cmbDrugItemCH);

            txtSearchName.addEventListener("keyup",btnSearchMC);

            privilages = httpRequest("../privilage?module=SUPPLIER","GET");
    
            suppliertypes = httpRequest("../itemtype/list","GET");
            supplierstatuses = httpRequest("../supplierstatus/list","GET");
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
            suppliers = new Array();
          var data = httpRequest("/supplier/findAll?page="+page+"&size="+size+query,"GET");
            if(data.content!= undefined) suppliers = data.content;
            createPagination('pagination',data.totalPages, data.number+1,paginate);
            fillTable('tblSupplier',suppliers,fillForm,btnDeleteMC,viewitem);
            clearSelection(tblSupplier);

            if(activerowno!="")selectRow(tblSupplier,activerowno,active);

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

        function viewitem(sup,rowno) {

            supplierveiw = JSON.parse(JSON.stringify(sup));

            tdsregno.innerHTML = supplierveiw.regno;
            tdsname.innerHTML = supplierveiw.fullname;
            tdsaddres.innerHTML = supplierveiw.address;
            tdemail.innerHTML = supplierveiw.email;
            tdlandno.innerHTML = supplierveiw.landno;
            tdcpname.innerHTML = supplierveiw.cpname;
            tdcpmno.innerHTML = supplierveiw.cpcontactno;
            tdstype.innerHTML = supplierveiw.supplytype_id.name;

            if(supplierveiw.supplytype_id.name == "Drug"){
                fillInnerTable("tblPrintInnerDrugItem",supplierveiw.supplierHasItemsList,innerModify, innerDelete, innerVeiw);
                $('#lblDrug').removeAttr("style");
                $('#tblDrug').removeAttr("style");
                $('#lblGrocery').css("display","none");
                $('#tblGrocery').css("display","none");

            }else{
                $('#lblDrug').css("display","none");
                $('#tblDrug').css("display","none");
                $('#lblGrocery').removeAttr("style");
                $('#tblGrocery').removeAttr("style");
                fillInnerTable("tblPrintInnerGroceryItem",supplierveiw.supplierHasItemsList,innerModify, innerDelete, innerVeiw);
            }

            tdbhname.innerHTML = supplierveiw.bankholdername;
            tdbname.innerHTML = supplierveiw.bankname;
            tdbbranch.innerHTML = supplierveiw.bankbranchname;
            tdaccno.innerHTML = supplierveiw.bankaccno;
            tdasign.innerHTML = supplierveiw.employee_id.callingname;
            tdaddate.innerHTML = supplierveiw.addeddate;
            tdsstatus.innerHTML = supplierveiw.supplirstatus_id.name;
            tddesc.innerHTML = supplierveiw.description;

            if(supplierveiw.creditlimit == null){
                tdcredlimt.innerHTML ="0.00";
            }else
            tdcredlimt.innerHTML = parseFloat(supplierveiw.creditlimit).toFixed(2);

            if(supplierveiw.arreaseamount == null){
                tdAresAmnt.innerHTML ="0.00";
            }else
                tdAresAmnt.innerHTML = parseFloat(supplierveiw.arreaseamount).toFixed(2);

            $('#dataVeiwModal').modal('show')


         }

         function btnPrintRowMC(){

             var format = printformtable.outerHTML;

             var newwindow=window.open();
             newwindow.document.write("<html>" +
                 "<head><style type='text/css'>.google-visualization-table-th {text-align: left;}</style>" +
                 "<link rel=\'stylesheet\' href=\'resources/bootstrap/css/bootstrap.min.css\'></head>" +
                 "<body><div style='margin-top: 150px'><h1 style='text-align: center'>Dharshana Pharmacy & Grocery</h1><h2>Supplier Details :</h2></div>" +
                 "<div>"+format+"</div>" +
                 "<script>printformtable.removeAttribute('style')</script>" +
                 "</body></html>");
             setTimeout(function () {newwindow.print(); newwindow.close();},100);
         }

         function cmbSTypeCH() {
            if(supplier.supplytype_id.name == "Drug"){
                innerDrug.style.display = "block";
                innerGrocery.style.display ="none";
                refreshInnerDrug();

            }else{
                innerDrug.style.display = "none";
                innerGrocery.style.display = "block";
                refreshInnerGrocery();
            }

         }

         function cmbGroceryItemCH() {
             btnInnerGroceryAdd.disabled = false;
         }
        function cmbDrugItemCH() {
            btnInnerDrugAdd.disabled = false;
         }

        function loadForm() {
            supplier = new Object();
            oldsupplier = null;

            //create new arra
            supplier.supplierHasItemsList = new Array();

            // fill data into combo
            // fillCombo(feildid, message, datalist, displayproperty, selected value)
             fillCombo(cmbSupType,"Select Supplier Type", suppliertypes,"name","");

             // fill and auto select / auto bind
             fillCombo(cmbSupStatus,"",supplierstatuses,"name","Available");
             fillCombo(cmbAssignBy,"",employees,"callingname",session.getObject('activeuser').employeeId.callingname);

             supplier.supplirstatus_id=JSON.parse(cmbSupStatus.value);
             cmbSupStatus.disabled = true;

            supplier.employee_id=JSON.parse(cmbAssignBy.value);
            cmbAssignBy.disabled = true;

            // ceate date object
             var today = new Date();
             // get month --> array(0-11)
             var month = today.getMonth()+1;
             if(month<10) month = "0"+month;// YYYY-MM-DD
            //get date --> range(1-31)
             var date = today.getDate();
             if(date<10) date = "0"+date;// YYYY-MM-DD

            dteAsignDate.value=today.getFullYear()+"-"+month+"-"+date;
            supplier.addeddate=dteAsignDate.value;
            dteAsignDate.disabled = true;

            // Get Next Number Form Data Base
            var nextNumber = httpRequest("/supplier/nextnumber", "GET");
            txtSupRegNo.value = nextNumber.regno;
            supplier.regno = txtSupRegNo.value;
            txtSupRegNo.disabled="disabled";

            //textfeild empty
             txtSupFullName.value = "";
             txtSupAddress.value = "";
             txtSupEmail.value = "";
             txtSupMobile.value = "";
             txtCPName.value = "";
             txtCPMobile.value = "";
             cmbSupType.value = "";
             txtSupDescription.value = "";
             txtBankHolderName.value = "";
             txtBankName.value = "";
             txtBankBranch.value = "";
             txtBankAccNo.value = "";
             txtCreditLmt.value = "";

             setStyle(initial);

            cmbAssignBy.style.border=valid;
            dteAsignDate.style.border=valid;
            cmbSupStatus.style.border=valid;
            txtSupRegNo.style.border=valid;

             disableButtons(false, true, true);

             refreshInnerDrug();
             refreshInnerGrocery();

        }

        function setStyle(style) {
            txtSupRegNo.style.border = style;
            txtSupFullName.style.border = style;
            txtSupAddress.style.border = style;
            txtSupEmail.style.border = style;
            txtSupMobile.style.border = style;
            txtCPName.style.border = style;
            txtCPMobile.style.border = style;
            cmbSupType.style.border = style;
            dteAsignDate.style.border = style;
            cmbSupStatus.style.border = style;
            cmbAssignBy.style.border = style;
            txtSupDescription.style.border = style;
            txtBankHolderName.style.border = style;
            txtBankName.style.border = style;
            txtBankBranch.style.border = style;
            txtBankAccNo.style.border = style;
            txtCreditLmt.style.border = style;


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
            for(index in suppliers){
                if(suppliers[index].supplirstatus_id.name =="Removed"){
                    tblSupplier.children[1].children[index].style.color = "#f00";
                    tblSupplier.children[1].children[index].style.border = "2px solid red";
                    tblSupplier.children[1].children[index].lastChild.children[1].disabled = true;
                    tblSupplier.children[1].children[index].lastChild.children[1].style.cursor = "not-allowed";

                }
            }

        }
        function refreshInnerDrug() {
            supplierHasItem = new Object();
            oldsupplierHasItem = null;

            btnInnerDrugAdd.disabled = true;

            //auto fill combobox
            fillCombo(cmbDrugItem,"Select Drug Item", subitems,"subitemname","");
            cmbDrugItem.style.border=initial;

            // Inner Table
            fillInnerTable("tblInnerDrug",supplier.supplierHasItemsList,innerModify, innerDelete, innerVeiw);
            if(supplier.supplierHasItemsList.length !=0){
                for (var index in supplier.supplierHasItemsList){
                    tblInnerDrug.children[1].children[index].lastChild.children[0].style.display= "none";
                }
                cmbSupType.disabled = true;
            }else
                cmbSupType.disabled = false;

        }

        function btnInnerAddDrugMc() {

            var itnext = false;
            for(var index in supplier.supplierHasItemsList){
                if (supplier.supplierHasItemsList[index].subitem_id.subitemname == supplierHasItem.subitem_id.subitemname ){
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
                supplier.supplierHasItemsList.push(supplierHasItem);
                refreshInnerDrug();
            }
        }

        function refreshInnerGrocery() {
            supplierHasItem = new Object();
            oldsupplierHasItem = null;

            //auto fill combobox
            fillCombo(cmbGroceryItem,"Select Grocery Item", items,"itemname","");
            cmbGroceryItem.style.border=initial;

            btnInnerGroceryAdd.disabled = true;

            /*if(cmbGroceryItem.value != ""){
                btnInnerGroceryAdd.disabled = false;
            }*/

            // Inner Table
            fillInnerTable("tblInnerGrocery",supplier.supplierHasItemsList,innerModify, innerDelete, innerVeiw);
            if(supplier.supplierHasItemsList.length !=0){
                for (var index in supplier.supplierHasItemsList){
                    tblInnerGrocery.children[1].children[index].lastChild.children[0].style.display= "none";
                }
                cmbSupType.disabled = true;
            }else
                cmbSupType.disabled = false;
        }

        function btnInnerGroceryAddMc() {

            var itnext = false;
            for(var index in supplier.supplierHasItemsList){
                if (supplier.supplierHasItemsList[index].item_id.itemname == supplierHasItem.item_id.itemname ){
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
                supplier.supplierHasItemsList.push(supplierHasItem);
                refreshInnerGrocery();
            }
        }

        function btnInnerClearMc() {
            //inner drug clear
            if (JSON.parse(cmbSupType.value).name == "Drug"){
                if(supplierHasItem.subitem_id != null){
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
                if(supplierHasItem.item_id != null){
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
            if (supplier.supplytype_id.name == "Drug"){
                swal({
                    title: "Are you sure to delete item?",
                    text: "\n" +
                        "Item Name : " + innerob.subitem_id.subitemname,
                    icon: "warning", buttons: true, dangerMode: true,
                }).then((willDelete) => {
                    if (willDelete) {
                        supplier.supplierHasItemsList.splice(innerrow,1);
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
                        supplier.supplierHasItemsList.splice(innerrow,1);
                        refreshInnerGrocery();
                    }

                });
            }

        }
        function innerVeiw() {}

        function getErrors() {

            var errors = "";
            addvalue = "";

            if (supplier.regno == null) {
                txtSupRegNo.style.border = invalid;
                errors = errors + "\n" + "Supplier Regno Not Enter";
            }
            else  addvalue = 1;

            if (supplier.fullname == null) {
                txtSupFullName.style.border = invalid;
                errors = errors + "\n" + "Supplier Name Not Enter";
            }
            else  addvalue = 1;

            if (supplier.email == null) {
                txtSupEmail.style.border = invalid;
                errors = errors + "\n" + "Email Not Enter";
            }
            else  addvalue = 1;

            if (supplier.landno == null) {
                txtSupMobile.style.border = invalid;
                errors = errors + "\n" + "Land No Not Enter";
            }
            else  addvalue = 1;

            if (supplier.address == null) {
                txtSupAddress.style.border = invalid;
                errors = errors + "\n" + "Address Not Enter";
            }
            else  addvalue = 1;

            if (supplier.cpname == null) {
                txtCPName.style.border = invalid;
                errors = errors + "\n" + "Contact Person Name Not Enter";
            }
            else  addvalue = 1;

            if (supplier.cpcontactno == null) {
                txtCPMobile.style.border = invalid;
                errors = errors + "\n" + "Contact Person Mobile No Not Enter";
            }
            else  addvalue = 1;

            if (supplier.supplytype_id == null) {
                cmbSupType.style.border = invalid;
                errors = errors + "\n" + "Supplier Type Not Selected";
            }
            else  {addvalue = 1;


            if (supplier.supplierHasItemsList.length ==0 ) {
                 if(supplier.supplytype_id.name == "Grocery" )
                    cmbGroceryItem.style.border = invalid;
                else
                    //cmbGroceryItem.style.border = invalid;
                    cmbDrugItem.style.border = invalid;
                errors = errors + "\n" + "Supplier Item Not Added";
                }
                else  addvalue = 1;}



            return errors;

        }

        function btnAddMC(){
            if(getErrors()==""){
                if(txtSupDescription.value=="" || txtBankHolderName.value=="" || txtBankName.value =="" ||
                    txtBankBranch.value=="" || txtBankAccNo.value =="" || txtCreditLmt.value ==""){
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
                title: "Are you sure to add following Supplier...?" ,
                  text :  "\nSupplier Regno : " + supplier.regno +
                    "\nSupplier Name : " + supplier.fullname +
                    "\nEmail : " + supplier.email +
                    "\nLand No : " + supplier.landno +
                    "\nAddress : " + supplier.address +
                    "\nContact Person name : " + supplier.cpname +
                    "\nContact Mobile No : " + supplier.cpcontactno +
                      "\nSupplier Type : " + supplier.supplytype_id.name +
                    "\nSupplier Status : " + supplier.supplirstatus_id.name,
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
                    var response = httpRequest("/supplier", "POST", supplier);
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

            if(oldsupplier == null && addvalue == ""){
                loadForm();
            }else{
                swal({
                    title: "Form has some values, updates values... Are you sure to discard the form ?",
                    text: "\n" ,
                    icon: "warning", buttons: true, dangerMode: true,
                }).then((willDelete) => {
                    if (willDelete) {
                        loadForm();
                    }

                });
            }

        }

        function fillForm(sup,rowno){
            activerowno = rowno;

            if (oldsupplier==null) {
                filldata(sup);
            } else {
                swal({
                    title: "Form has some values, updates values... Are you sure to discard the form ?",
                    text: "\n" ,
                    icon: "warning", buttons: true, dangerMode: true,
                }).then((willDelete) => {
                    if (willDelete) {
                        filldata(sup);
                    }

                });
            }

        }

        // Re fill data into form
        function filldata(sup) {
            clearSelection(tblSupplier);
            selectRow(tblSupplier,activerowno,active);

            supplier = JSON.parse(JSON.stringify(sup));
            oldsupplier = JSON.parse(JSON.stringify(sup));

            txtSupRegNo.value = supplier.regno;
            txtSupRegNo.disabled="disabled";
            txtSupFullName.value = supplier.fullname;
            txtSupAddress.value = supplier.address;
            txtSupEmail.value = supplier.email;
            txtSupMobile.value = supplier.landno;
            txtCPName.value = supplier.cpname;
            txtCPMobile.value = supplier.cpcontactno;
            txtCreditLmt.value = toDecimal(supplier.creditlimit);
            dteAsignDate.value = supplier.addeddate;
            txtBankHolderName.value = supplier.bankholdername;
            txtBankName.value = supplier.bankname;
            txtBankBranch.value = supplier.bankbranchname;
            txtBankAccNo.value = supplier.bankaccno;
            txtSupDescription.value = supplier.description;

            fillCombo(cmbSupType,"Select Supplier Type", suppliertypes,"name",supplier.supplytype_id.name);

            fillCombo(cmbSupStatus,"",supplierstatuses,"name",supplier.supplirstatus_id.name);
            cmbSupStatus.disabled = false;
            fillCombo(cmbAssignBy,"",employees,"callingname",supplier.employee_id.callingname);

            // setDefaultFile('flePhoto', item.photo);

            disableButtons(true, false, false);
            setStyle(valid);
            changeTab('form');

            //innerform
            if(supplier.supplytype_id.name == "Drug"){
                refreshInnerDrug();
                innerDrug.style.display = "block";
                innerGrocery.style.display = "none";
                $('#collapseTwo').collapse('show')
            }else {
                refreshInnerGrocery();
                innerGrocery.style.display = "block";
                innerDrug.style.display = "none";
                $('#collapseFour').collapse('show')
            }

            //  optional feild
            if(supplier.description == null)
                txtSupDescription.style.border = initial;

            if(supplier.bankholdername == null)
                txtBankHolderName.style.border = initial;

            if(supplier.bankname == null)
                txtBankName.style.border = initial;

            if(supplier.bankbranchname == null)
                txtBankBranch.style.border = initial;

            if(supplier.bankaccno == null)
                txtBankAccNo.style.border = initial;

            if(supplier.creditlimit == null)
                txtCreditLmt.style.border = initial;
        }

        function getUpdates() {

            var updates = "";

            if(supplier!=null && oldsupplier!=null) {

                if (supplier.regno != oldsupplier.regno)
                    updates = updates + "\nSupplier Regno is Changed " + oldsupplier.regno + " into " + supplier.regno;

                if (supplier.fullname != oldsupplier.fullname)
                    updates = updates + "\nSupplier Name is Changed " + oldsupplier.fullname + " into " + supplier.fullname;

                if (supplier.email != oldsupplier.email)
                    updates = updates + "\nSupplier Email is Changed " + oldsupplier.email + " into " + supplier.email;

                if (supplier.landno != oldsupplier.landno)
                    updates = updates + "\nSupplier Mobiile No is Changed " + oldsupplier.landno + " into " + supplier.landno;

                if (supplier.address != oldsupplier.address)
                    updates = updates + "\nAddress is Changed " + oldsupplier.address + " into " + supplier.address;

                if (supplier.cpname != oldsupplier.cpname)
                    updates = updates + "\nContact Person Name is Changed " + oldsupplier.cpname + " into " + supplier.cpname;

                if (supplier.cpcontactno != oldsupplier.cpcontactno)
                    updates = updates + "\nContact Mobile No is Changed " + oldsupplier.cpcontactno + " into " + supplier.cpcontactno;

                if (supplier.bankholdername != oldsupplier.bankholdername)
                    updates = updates + "\nSBank Holder Name No is Changed " + oldsupplier.bankholdername + " into " + supplier.bankholdername;

                if (supplier.supplytype_id.name != oldsupplier.supplytype_id.name)
                    updates = updates + "\nSupplier Type is Changed " + oldsupplier.supplytype_id.name + " into " + supplier.supplytype_id.name;

                if (supplier.bankname != oldsupplier.bankname)
                    updates = updates + "\nBank Name is Changed " + oldsupplier.bankname + " into " + supplier.bankname;

                if (supplier.bankbranchname != oldsupplier.bankbranchname)
                    updates = updates + "\nBank Branch Name is Changed " + oldsupplier.bankbranchname + " into " + supplier.bankbranchname;

                if (supplier.bankaccno != oldsupplier.bankaccno)
                    updates = updates + "\nBAnk Account Number is Changed " + oldsupplier.bankaccno + " into " + supplier.bankaccno;

                if (supplier.creditlimit != oldsupplier.creditlimit)
                    updates = updates + "\nCredit Limit is Changed " + oldsupplier.creditlimit + " into " + supplier.creditlimit;

                if (supplier.description != oldsupplier.description)
                    updates = updates + "\nDescription is Changed " + oldsupplier.description + " into " + supplier.description;

                if (supplier.supplirstatus_id.name != oldsupplier.supplirstatus_id.name)
                    updates = updates + "\nSupplierstatus is Changed " + oldsupplier.supplirstatus_id.name + " into " + supplier.supplirstatus_id.name;

                if(supplier.supplytype_id.name=="Drug"){
                    if (isEqual(supplier.supplierHasItemsList,oldsupplier.supplierHasItemsList,"subitem_id"))
                    updates = updates + "\nSupplier Item is Changed " ;
                }else {
                    if (isEqual(supplier.supplierHasItemsList, oldsupplier.supplierHasItemsList, "item_id"))
                        updates = updates + "\nSupplier Item is Changed ";
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
                        title: "Are you sure to update following Supplier details...?",
                        text: "\n"+ getUpdates(),
                        icon: "warning", buttons: true, dangerMode: true,
                    })
                        .then((willDelete) => {
                        if (willDelete) {
                            var response = httpRequest("/supplier", "PUT", supplier);
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
                                    text: 'You ave ollowing error \n '+response,
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

        function btnDeleteMC(sup) {
            supplier = JSON.parse(JSON.stringify(sup));

            swal({
                title: "Are you sure to delete following Supplier...?",
                text: "\nSupplier Regno : " + supplier.regno +
                "\n Supplier Name : " + supplier.fullname,
                icon: "warning", buttons: true, dangerMode: true,
            }).then((willDelete)=> {
                if (willDelete) {
                    var responce = httpRequest("/supplier","DELETE",supplier);
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
            formattab = tblSupplier.outerHTML;

           newwindow.document.write("" +
                "<html>" +
                "<head><style type='text/css'>.google-visualization-table-th {text-align: left;} .modifybutton{display: none} .isort{display: none}</style>" +
                "<link rel='stylesheet' href='../resources/bootstrap/css/bootstrap.min.css'/></head>" +
                "<body><div style='margin-top: 150px; '><h1 style='text-align: center'>Dharshana Pharmacy & Grocery</h1><h2>Supplier Details : </h2></div>" +
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

        //email binder for duplicate fullname
        function fullnameBinder() {
            //txtSupFullName,'^.*$','supplier','fullname','oldsupplier'
            var val = txtSupFullName.value.trim();
            if (val != ""){
                var regpattern = new RegExp('^.*$');
                if (regpattern.test(val)){
                    var response = httpRequest("/supplier/byfullname?fullname="+val, "GET");
                    if (response == ""){
                        supplier.fullname = val;
                        if ( oldsupplier!= null && supplier.fullname != oldsupplier.fullname){
                            txtSupFullName.style.border = updated;
                        }else {
                            txtSupFullName.style.border = valid;
                        }
                    }else {
                        swal({
                            title: "Supplier Name already exit....!",
                            text: "\n\n" ,
                            icon: "warning", button: false, timer: 1500
                        });
                        txtSupFullName.style.border = invalid;
                        supplier.fullname = null;
                    }
                }else {
                    txtSupFullName.style.border = invalid;
                    supplier.fullname = null;
                }
            }else{
                if (txtSupFullName.required){
                    txtSupFullName.style.border = invalid;

                }else {
                    txtSupFullName.style.border = initial;
                }
                supplier.fullname = null;
            }
        }

        //email binder for duplicate emails
        function emailBinder() {
            //txtSupEmail,'^.*$','supplier','email','oldsupplier'
            var val = txtSupEmail.value.trim();
            if (val != ""){
                var regpattern = new RegExp('^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+\.[a-z]{2,3}$');
                if (regpattern.test(val)){
                    var response = httpRequest("/supplier/byemail?email="+val, "GET");
                    if (response == ""){
                        supplier.email = val;
                        if ( oldsupplier!= null && supplier.email != oldsupplier.email){
                            txtSupEmail.style.border = updated;
                        }else {
                            txtSupEmail.style.border = valid;
                        }
                    }else {
                        swal({
                            title: "Email already exit....!",
                            text: "\n\n" ,
                            icon: "warning", button: false, timer: 1500
                        });
                        txtSupEmail.style.border = invalid;
                        supplier.email = null;
                    }
                }else {
                    txtSupEmail.style.border = invalid;
                    supplier.email = null;
                }
            }else{
                if (txtSupEmail.required){
                    txtSupEmail.style.border = invalid;

                }else {
                    txtSupEmail.style.border = initial;
                }
                supplier.email = null;
            }
        }

        //land number binder for duplicate land numbers
        function landNoBinder() {
            //console.log(txtSupMobile.value);
            //txtSupMobile,'^0((11)|(2(1|[3-7]))|(3[1-8])|(4(1|5|7))|(5(1|2|4|5|7))|(6(3|[5-7]))|([8-9]1))[0-9]{7}$','supplier','landno','oldsupplier'
            var val = txtSupMobile.value.trim();
            if (val != ""){
                var regpattern = new RegExp('^0((11)|(2(1|[3-7]))|(3[1-8])|(4(1|5|7))|(5(1|2|4|5|7))|(6(3|[5-7]))|([8-9]1))[0-9]{7}$');
                if (regpattern.test(val)){
                    var response = httpRequest("/supplier/bylandno?landno="+val, "GET");
                    if (response == ""){
                        supplier.landno = val;
                        if ( oldsupplier!= null && supplier.landno != oldsupplier.landno){
                            txtSupMobile.style.border = updated;
                        }else {
                            txtSupMobile.style.border = valid;
                        }
                    }else {
                        swal({
                            title: "Land Number already exit....!",
                            text: "\n\n" ,
                            icon: "warning", button: false, timer: 1500
                        });
                        txtSupMobile.style.border = invalid;
                        supplier.landno = null;
                    }
                }else {
                    txtSupMobile.style.border = invalid;
                    supplier.landno = null;
                }
            }else{
                if (txtSupMobile.required){
                    txtSupMobile.style.border = invalid;

                }else {
                    txtSupMobile.style.border = initial;
                }
                supplier.landno = null;
            }
        }