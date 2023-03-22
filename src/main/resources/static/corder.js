

 

        window.addEventListener("load", initialize);

        //Initializing Functions

        function initialize() {

            //tooltip enable
            $('[data-toggle="tooltip"]').tooltip();

            $('.js-example-basic-single').select2();

            // add / clear / update buttons Event Handler
            btnAdd.addEventListener("click",btnAddMC);
            btnClear.addEventListener("click",btnClearMC);
            btnUpdate.addEventListener("click",btnUpdateMC);

            cmbItem.addEventListener("change",cmbItemCH);

            txtQuantity.addEventListener("keyup",txtQuantityCH);

            txtSearchName.addEventListener("keyup",btnSearchMC);

            //customer model
            btnAddMod.addEventListener("click",btnCustomerAddMC);
            btnClearMod.addEventListener("click",btnCustomerClearMC);


            privilages = httpRequest("../privilage?module=CORDER","GET");

            customers = httpRequest("../customer/namelist","GET");
            batches = httpRequest("../batch/batchlist","GET");
            // drugbatches = httpRequest("../batch/drugbatch","GET");
            // grocerybatches = httpRequest("../batch/grocerybatch","GET");
            corderstatuses = httpRequest("../corderstatus/list","GET");
            employees = httpRequest("../employee/list","GET");

            //Data list for inner fillcombo box
            groceryitems = httpRequest("../item/listgrocery","GET");
            drugitems = httpRequest("../item/listdrug","GET");

            //data list for customer new mdel
            customertypes = httpRequest("../customertype/list","GET");
            customerststuses = httpRequest("../customerstatus/list","GET");
            genders = httpRequest("../gender/list","GET");

            valid = "2px solid green";
            invalid = "2px solid red";
            initial = "2px solid #d6d6c2";
            updated = "2px solid #ff9900";
            active = "#ff9900";

            loadView();
            loadForm();
            loadCustomerForm();

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
            corders = new Array();
          var data = httpRequest("/corder/findAll?page="+page+"&size="+size+query,"GET");
            if(data.content!= undefined) corders = data.content;
            createPagination('pagination',data.totalPages, data.number+1,paginate);
            fillTable('tblCorder',corders,fillForm,btnDeleteMC,viewitem);
            clearSelection(tblCorder);

            if(activerowno!="")selectRow(tblCorder,activerowno,active);

        }

        function paginate(page) {
            var paginate;
            if(oldcorder==null){
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

        function viewitem(cod,rowno) {

            codview = JSON.parse(JSON.stringify(cod));

            tdCcode.innerHTML = codview.cordercode;
            tdcname.innerHTML = codview.customer_id.callingname;
            tddtRequtDt.innerHTML = codview.requiredate;
            tddtTotlAmount.innerHTML = parseFloat(codview.grandtotal).toFixed(2);

            fillInnerTable("tblPrintInnerDrugItem",codview.corderHasItemsList,innerModify, innerDelete, innerVeiw);

            tdasign.innerHTML = codview.employee_id.callingname;
            tdaddate.innerHTML = codview.addeddate;
            tdpstatus.innerHTML = codview.corderstatus_id.name;
            tddesc.innerHTML = codview.description;

            if(codview.deliveryrequired == true){
                tddel.innerHTML = "Required";
                tdcpname.innerHTML = codview.cpname;
                tdcpmobile.innerHTML = codview.cpmobile;
                tdcpadddess.innerHTML = codview.address;
                $('#iddel1').removeAttr("style");
                $('#iddel2').removeAttr("style");
            }else {
                tddel.innerHTML = "Not Required";
                $('#iddel1').css("display","none");
                $('#iddel2').css("display","none");
            }

            $('#dataVeiwModal').modal('show')


         }

         function btnPrintRowMC(){

             var format = printformtable.outerHTML;

             var newwindow=window.open();
             newwindow.document.write("<html>" +
                 "<head><style type='text/css'>.google-visualization-table-th {text-align: left;}</style>" +
                 "<link rel=\'stylesheet\' href=\'resources/bootstrap/css/bootstrap.min.css\'></head>" +
                 "<body><div style='margin-top: 150px'><h1 style='text-align: center'>Dharshana Pharmacy & Grocery</h1><h2>Corder Details :</h2></div>" +
                 "<div>"+format+"</div>" +
                 "<script>printformtable.removeAttribute('style')</script>" +
                 "</body></html>");
             setTimeout(function () {newwindow.print(); newwindow.close();},100);
         }

         function chDiliveryMC() {
            //console.log(chDilivery.checked);
             if(chDilivery.checked){
                 corder.deliveryrequired = true;
                 divCP.style.display = "block";
                 divCM.style.display = "block";
                 divAdds.style.display = "block";
             }else {
                 corder.deliveryrequired = false;
                 divCP.style.display = "none";
                 divCM.style.display = "none";
                 divAdds.style.display = "none";
             }
         }

        /*function chItemTypeCH(){
            //console.log(chItemType.checked);
            if(chItemType.checked){
                //fillCombo(cmbItem,"Select Item", drugitems,"itemname","");
                fillCombo3(cmbItem,"Select batch/Item",batches,"batchno","item_id.itemname","");
            }else {
                //fillCombo(cmbItem,"Select Item", groceryitems,"itemname","");
                fillCombo3(cmbItem,"Select batch/Item",grocerybatches,"batchno","item_id.itemname","");
            }

        }*/

        function cmbItemCH() {
            var today = dteAddedDate.value;
            console.log(today);
            if(JSON.parse(cmbItem.value).item_id.prescriptionrequired == true){
                swal({
                    title: 'You need a prescription for sale this item...',icon: "warning",
                    text: '\n',
                    button: false,
                    timer: 1200});
            }

            if(JSON.parse(cmbItem.value).expdate == dteAddedDate.value){
                swal({
                    title: 'This item is Expiring soon!...',icon: "warning",
                    text: '\n',
                    button: false,
                    timer: 1600});
                btnInnerAdd.disabled = true;
                txtQuantity.disabled=true;
                $("#selectItem .select2-container").css('border',invalid);
                btnInnerAdd.style.cursor = "not-allowed";
                //cmbItem.style.border = invalid;
            }else{
                //txtSalesPrice.style.border=initial;
                txtQuantity.style.border=initial;

                txtSalesPrice.value = parseFloat(JSON.parse(cmbItem.value).salesprice).toFixed(2);
                //console.log($('#selectItem').select2('data'));
                corderHasItem.salesprice = txtSalesPrice.value;
                //txtSalesPrice.value = "";
                txtQuantity.value = "";
                txtLineTotal.value = "0.00";

                //txtSalesPrice.disabled=false;
                txtQuantity.disabled=false;
            }

        }


        function txtQuantityCH() {
            var val = txtQuantity.value.trim();
            if (val != ""){
                var regpattern = new RegExp('^[0-9]{1,2}$');
                if (regpattern.test(val)){
                    if(oldcorderHasItem != null && oldcorderHasItem.qty != txtQuantity.value){
                        txtQuantity.style.border = updated;
                        btnInnerUpdate.disabled = false;
                        btnInnerAdd.disabled = true;
                    }else {
                        btnInnerAdd.disabled = false;
                        btnInnerUpdate.disabled = true;
                    }
                    //btnInnerAdd.disabled = false;
                    txtLineTotal.value = (parseFloat(txtSalesPrice.value) * parseFloat(txtQuantity.value)).toFixed(2);
                    //txtDrugLineTotal.style.border = valid;
                    corderHasItem.linetotal = txtLineTotal.value;
                }else {
                    btnInnerAdd.disabled = true;
                    btnInnerUpdate.disabled = true;
                }
            }else {
                btnInnerAdd.disabled = true;
                btnInnerUpdate.disabled = true;
            }
        }

        function loadForm() {

            corder = new Object();
            oldcorder = null;

            //create new array
            corder.corderHasItemsList = new Array();

            // fill data into combo
            // fillCombo(feildid, message, datalist, displayproperty, selected value)
             fillCombo(cmbCustomerId,"Select Customer Name", customers,"callingname","");

             // fill and auto select / auto bind
             fillCombo(cmbCOrderStatus,"",corderstatuses,"name","Ordered");
             fillCombo(cmbAssignBy,"",employees,"callingname",session.getObject('activeuser').employeeId.callingname);

            corder.corderstatus_id=JSON.parse(cmbCOrderStatus.value);
            cmbCOrderStatus.disabled = true;

            corder.employee_id=JSON.parse(cmbAssignBy.value);
            cmbAssignBy.disabled = true;

            dteAddedDate.value=getCurrentDateTime('date');;
            corder.addeddate=dteAddedDate.value;
            dteAddedDate.disabled = true;

            // Get Next Number Form Data Base
            var nextNumber = httpRequest("/corder/nextnumber", "GET");
            txtCorderCode.value = nextNumber.cordercode;
            corder.cordercode = txtCorderCode.value;
            txtCorderCode.disabled=true;

            //textfeild empty
            cmbCustomerId.value = "";
            dteRequireDate.value = "";
            txtTotalAmount.value = "";
            txtCOrderDescription.value = "";
            txtCPName.value = "";
            txtCPMobile.value = "";
            txtAddress.value = "";

            chDilivery.checked = false;
            $('#chDilivery').bootstrapToggle('off')
            corder.deliveryrequired = false;
            divCP.style.display = "none";
            divCM.style.display = "none";
            divAdds.style.display = "none";

            dteRequireDate.value = "";
            //set min date for require date
            dteRequireDate.min = getCurrentDateTime('date');
            //set max date for require date
            dteRequireDate.max = maxAndMinDate('max',dteAddedDate,7);

            txtTotalAmount.disabled = true;

             setStyle(initial);

            txtCorderCode.style.border=valid;
            dteAddedDate.style.border=valid;
            cmbCOrderStatus.style.border=valid;
            cmbAssignBy.style.border=valid;

             disableButtons(false, true, true);

             refreshInner();
            loadCustomerForm();
        }

        function setStyle(style) {
            txtCorderCode.style.border = style;
            dteAddedDate.style.border = style;
            $("#seelectCustomerId .select2-container").css('border',style);
            dteRequireDate.style.border = style;
            txtTotalAmount.style.border = style;
            cmbCOrderStatus.style.border = style;
            txtCOrderDescription.style.border = style;
            chDilivery.style.border = style;
            txtCPName.style.border = style;
            txtCPMobile.style.border = style;
            txtAddress.style.border = style;

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
            for(index in corders){
                if(corders[index].corderstatus_id.name =="Removed"){
                    tblCorder.children[1].children[index].style.color = "#f00";
                    tblCorder.children[1].children[index].style.border = "2px solid red";
                    tblCorder.children[1].children[index].lastChild.children[1].disabled = true;
                    tblCorder.children[1].children[index].lastChild.children[1].style.cursor = "not-allowed";

                }
            }

        }

        function refreshInner() {
            corderHasItem = new Object();
            oldcorderHasItem = null;

            totalAmount= 0;

            btnInnerUpdate.disabled = true;
            btnInnerAdd.disabled = true;

           /* type = document.getElementById('chItemType').checked;
            console.log(type);
            chItemType.checked = type;*/

            //chItemTypeCH();
            fillCombo3(cmbItem,"Select batch/Item",batches,"batchno","item_id.itemname","");

            $("#selectItem .select2-container").css('border',initial);
            //cmbItem.style.border=initial;
            txtQuantity.style.border=initial;

            txtSalesPrice.value = "";
            txtQuantity.value = "";
            txtLineTotal.value = "0.00";

            txtQuantity.disabled=true;

            // Inner Table
            fillInnerTable("tblInnerDrug",corder.corderHasItemsList,innerModify, innerDelete, true);
            if(corder.corderHasItemsList.length != 0){
                for (var index in corder.corderHasItemsList){
                    //tblInnerDrug.children[1].children[index].lastChild.children[0].style.display= "none";
                    totalAmount = (parseFloat(totalAmount) + parseFloat(corder.corderHasItemsList[index].linetotal)).toFixed(2);
                }
                txtTotalAmount.value = totalAmount;
                corder.grandtotal = txtTotalAmount.value;
                if(oldcorder != null && corder.grandtotal != oldcorder.grandtotal){
                    txtTotalAmount.style.border=updated;
                }else{
                    txtTotalAmount.style.border=valid   ;
                }

            }else {
                totalAmount = null;
                txtTotalAmount.value = totalAmount;
                // porder.totalamount = txtTotalAmount.value;
                corder.grandtotal = "";
                //txtTotalAmount.style.border = invalid;

            }

        }

        function btnInnerAddMc() {

            var itnext = false;
            for(var index in corder.corderHasItemsList){
                if (corder.corderHasItemsList[index].batch_id.item_id.itemname == corderHasItem.batch_id.item_id.itemname ){
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
                corder.corderHasItemsList.push(corderHasItem);
                refreshInner();
                cmbItem.disabled=false;
            }
        }

        function btnInnerClearMc() {
            if(corderHasItem.batch_id.item_id != null){
                swal({
                    title: "Are you sure to cler innerform?",
                    text: "\n",
                    icon: "warning", buttons: true, dangerMode: true,
                }).then((willDelete) => {
                    if (willDelete) {
                        refreshInner();
                        cmbItem.disabled=false;
                    }
                });
            }else {
                refreshInner();
                cmbItem.disabled=false;
            }
        }

        function innerModify(ob, innerrowno) {
            innerrow = innerrowno;

            corderHasItem = JSON.parse(JSON.stringify(ob));
            oldcorderHasItem = JSON.parse(JSON.stringify(ob));

            btnInnerUpdate.disabled = false;
            btnInnerAdd.disabled = true;
            $('#collapseOne').collapse('show')

            fillCombo3(cmbItem,"Select batch/Item",batches,"batchno","item_id.itemname",corderHasItem.batch_id.batchno);
            /*if(corderHasItem.batch_id.item_id.itemtype_id.name== "Drug"){
                chItemType.checked = true;
                $('#chItemType').bootstrapToggle('on');
                //fillCombo(cmbItem, "Select Item",drugitems, "itemname",corderHasItem.item_id.itemname);
                fillCombo3(cmbItem,"Select batch/Item",batches,"batchno","item_id.itemname",corderHasItem.batch_id.batchno);
            }else {
                chItemType.checked = false;
                $('#chItemType').bootstrapToggle('off');
                //fillCombo(cmbItem, "Select Item",groceryitems, "itemname",corderHasItem.item_id.itemname);
                fillCombo3(cmbItem,"Select batch/Item",grocerybatches,"batchno","item_id.itemname",corderHasItem.batch_id.batchno);
            }*/

            cmbItem.disabled = true;
            txtSalesPrice.value = parseFloat(corderHasItem.salesprice).toFixed(2);
            txtQuantity.value = corderHasItem.qty;
            txtQuantity.disabled = false;
            txtQuantity.style.border=valid;
            txtLineTotal.value = parseFloat(corderHasItem.linetotal).toFixed(2);
        }

        function btnInnerUpdateMc() {
            corder.corderHasItemsList[innerrow] = corderHasItem;
            swal({
                title: 'Updated...!',icon: "warning",
                text: '\n',
                button: false,
                timer: 1200});
            refreshInner();
            cmbItem.disabled=false;

        }

        function innerDelete(innerob,innerrow) {

                swal({
                    title: "Are you sure to delete item?",
                    text: "\n" +
                        "Item Name : " + innerob.batch_id.batchno + " "+ innerob.batch_id.item_id.itemname,
                    icon: "warning", buttons: true, dangerMode: true,
                }).then((willDelete) => {
                    if (willDelete) {
                        corder.corderHasItemsList.splice(innerrow,1);
                        refreshInner();
                        cmbItem.disabled=false;
                    }
                });
        }

        function innerVeiw() {}

        function getErrors() {

            var errors = "";
            addvalue = "";

            if (corder.customer_id == null) {
                cmbCustomerId.style.border = invalid;
                errors = errors + "\n" + "Customer Name Not Selected";
            }
            else  addvalue = 1;

            if (corder.requiredate == null) {
                dteRequireDate.style.border = invalid;
                errors = errors + "\n" + "Required Date Not Entered";
            }
            else  addvalue = 1;

            if (corder.grandtotal == null) {
                txtTotalAmount.style.border = invalid;
                errors = errors + "\n" + "Grand Total Not Entered";
            }
            else  addvalue = 1;

            if (chDilivery.checked) {
                if (corder.cpname == null) {
                    txtCPName.style.border = invalid;
                    errors = errors + "\n" + "Contact Name Not Entered";
                }
                else  addvalue = 1;
                if (corder.cpmobile == null) {
                    txtCPMobile.style.border = invalid;
                    errors = errors + "\n" + "Contact Mobile Not Entered";
                }
                else  addvalue = 1;
                if (corder.address == null) {
                    txtAddress.style.border = invalid;
                    errors = errors + "\n" + "Address Not Entered";
                }
                else  addvalue = 1;
            }

            if (corder.corderHasItemsList.length == 0 ) {
                cmbItem.style.border = invalid;
                errors = errors + "\n" + "Item And Purchase Price Not Added";
            }
            else  addvalue = 1;

            return errors;

        }

        function btnAddMC(){
            if(getErrors() == ""){
                if(txtCOrderDescription.value==""){
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
                title: "Are you sure to add following Customer Order...?" ,
                  text :  "\nCorder Code : " + corder.cordercode +
                    "\nCustomer Name : " + corder.customer_id.callingname +
                    "\nRequire Date : " + corder.requiredate +
                    "\nGrand Total : " + corder.grandtotal +
                    "\ncorder Status : " + corder.corderstatus_id.name,
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
                    var response = httpRequest("/corder", "POST", corder);
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

            if(corder == null && addvalue == ""){
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

        function fillForm(pod,rowno){
            activerowno = rowno;

            if (oldcorder==null) {
                filldata(pod);
            } else {
                swal({
                    title: "Form has some values, updates values... Are you sure to discard the form ?",
                    text: "\n" ,
                    icon: "warning", buttons: true, dangerMode: true,
                }).then((willDelete) => {
                    if (willDelete) {
                        filldata(pod);
                    }

                });
            }

        }

        // Re fill data into form
        function filldata(cod) {
            clearSelection(tblCorder);
            selectRow(tblCorder,activerowno,active);

            corder = JSON.parse(JSON.stringify(cod));
            oldcorder = JSON.parse(JSON.stringify(cod));

            txtCorderCode.value = corder.cordercode;
            txtCorderCode.disabled="disabled";
            dteRequireDate.value = corder.requiredate;
            dateUpdateFill('max',dteRequireDate,'corder','requiredate','oldcorder',7,'addeddate');
            txtTotalAmount.value = corder.totalamount;
            dteAddedDate.value = corder.addeddate;

            fillCombo(cmbCustomerId,"",customers,"callingname",corder.customer_id.name);

            if(corder.deliveryrequired==true){
                chDilivery.checked = true;
                $('#chDilivery').bootstrapToggle('on')
                txtCPName.value = corder.cpname;
                txtCPMobile.value = corder.cpmobile;
                txtAddress.value = corder.address;
                divCP.style.display = "block";
                divCM.style.display = "block";
                divAdds.style.display = "block";

            }else {
                chDilivery.checked = false;
                $('#chDilivery').bootstrapToggle('off')
                divCP.style.display = "none";
                divCM.style.display = "none";
                divAdds.style.display = "none";
            }

            //innerform
            refreshInner();
            $('#collapseTwo').collapse('show')

            fillCombo(cmbCOrderStatus,"",corderstatuses,"name",corder.corderstatus_id.name);
            cmbCOrderStatus.disabled = false;
            fillCombo(cmbAssignBy,"",employees,"callingname",corder.employee_id.callingname);

            disableButtons(true, false, false);
            setStyle(valid);
            changeTab('form');

            //  optional feild
            if(corder.description == null)
                txtCOrderDescription.style.border = initial;
        }

        function getUpdates() {

            var updates = "";

            if(corder!=null && oldcorder!=null) {

                if (corder.cordercode != oldcorder.cordercode)
                    updates = updates + "\nCorder Code is Changed " + oldcorder.cordercode + " into " + corder.cordercode;

                if (corder.customer_id.name != oldcorder.customer_id.name)
                    updates = updates + "\nCustomer Name is Changed " + oldcorder.customer_id.name + " into " + corder.customer_id.name;

                if (corder.requiredate != oldcorder.requiredate)
                    updates = updates + "\nRequire Date is Changed " + oldcorder.requiredate + " into " + corder.requiredate;

                if (corder.grandtotal != oldcorder.grandtotal)
                    updates = updates + "\nGrand Total is Changed " + oldcorder.grandtotal + " into " + corder.grandtotal;

                if (corder.description != oldcorder.description)
                    updates = updates + "\nDescription is Changed " + oldcorder.description + " into " + corder.description;

                if (corder.corderstatus_id.name != oldcorder.corderstatus_id.name)
                    updates = updates + "\nCorder status is Changed " + oldcorder.corderstatus_id.name + " into " + corder.corderstatus_id.name;

                if (isEqual(corder.corderHasItemsList, oldcorder.corderHasItemsList, "batch_id"))
                    updates = updates + "\nItem is Changed ";
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
                        title: "Are you sure to update following Customer Order details...?",
                        text: "\n"+ getUpdates(),
                        icon: "warning", buttons: true, dangerMode: true,
                    })
                        .then((willDelete) => {
                        if (willDelete) {
                            var response = httpRequest("/corder", "PUT", corder);
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

        function btnDeleteMC(cod) {
            corder = JSON.parse(JSON.stringify(cod));

            swal({
                title: "Are you sure to delete following Customer Order...?",
                text: "\nCorder Code : " + corder.cordercode,
                icon: "warning", buttons: true, dangerMode: true,
            }).then((willDelete)=> {
                if (willDelete) {
                    var responce = httpRequest("/corder","DELETE",corder);
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
            formattab = tblPorder.outerHTML;

           newwindow.document.write("" +
                "<html>" +
                "<head><style type='text/css'>.google-visualization-table-th {text-align: left;} .modifybutton{display: none} .isort{display: none}</style>" +
                "<link rel='stylesheet' href='../resources/bootstrap/css/bootstrap.min.css'/></head>" +
                "<body><div style='margin-top: 150px; '> <h1>Customer Order Details : </h1></div>" +
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

        function loadCustomerForm() {
            customer = new Object();
            oldcustomer = null;

            // fill data into combo
            // fillCombo(feildid, message, datalist, displayproperty, selected value)
            fillCombo(cmbCusType,"Select Customer Type", customertypes,"name","");
            fillCombo(cmbGender,"Select Gender",genders,"name","");

            // fill and auto select / auto bind
            fillCombo(cmbStatus,"",customerststuses,"name","Available");
            fillCombo(cmbAssignByC,"",employees,"callingname",session.getObject('activeuser').employeeId.callingname);

            customer.customerstatus_id=JSON.parse(cmbStatus.value);
            cmbStatus.disabled = true;

            customer.employee_id=JSON.parse(cmbAssignByC.value);
            cmbAssignByC.disabled = true;

            // ceate date object
            var today = new Date();
            // get month --> array(0-11)
            var month = today.getMonth()+1;
            if(month<10) month = "0"+month;// YYYY-MM-DD
            //get date --> range(1-31)
            var date = today.getDate();
            if(date<10) date = "0"+date;// YYYY-MM-DD

            dteAsignDate.value=today.getFullYear()+"-"+month+"-"+date;
            customer.addeddate=dteAsignDate.value;
            dteAsignDate.disabled = true;

            // Get Next Number Form Data Base
            var nextNumber = httpRequest("/customer/nextnumber", "GET");
            txtRegNo.value = nextNumber.regno;
            customer.regno = txtRegNo.value;
            txtRegNo.disabled="disabled";

            //textfeild empty
            txtCallingName.value = "";
            txtFullName.value = "";
            txtNIC.value = "";
            cmbGender.value = "";
            dteDob.value = "";
            txtCusAddress.value = "";
            txtCusDescription.value = "";
            txtMobile.value = "";
            txtLAnd.value = "";
            txtEmail.value = "";
            cmbCusType.value = "";

            customersetStyle(initial);

            cmbAssignByC.style.border=valid;
            dteAsignDate.style.border=valid;
            cmbStatus.style.border=valid;
            txtRegNo.style.border=valid;

            disableButtons(false, true, true);

        }

        function customersetStyle(style) {

            txtRegNo.style.border = style;
            txtCallingName.style.border = style;
            txtFullName.style.border = style;
            txtNIC.style.border = style;
            cmbGender.style.border = style;
            dteDob.style.border = style;
            txtCusAddress.style.border = style;
            txtCusDescription.style.border = style;
            txtMobile.style.border = style;
            txtLAnd.style.border = style;
            txtEmail.style.border = style;
            dteAsignDate.style.border = style;
            cmbCusType.style.border = style;
            cmbStatus.style.border = style;
            cmbAssignByC.style.border = style;



        }

        function nicTestFieldBinder(field,pattern,ob,prop,oldob) {
            var regpattern = new RegExp(pattern);

            var val = field.value.trim();
            if (regpattern.test(val)) {
                var dobyear, gendername,noOfDays = "";
                if (val.length===10){
                    dobyear = "19"+val.substring(0,2);
                    noOfDays = val.substring(2,5);
                }else{
                    dobyear = val.substring(0,4);
                    noOfDays = val.substring(4,7);
                }
                birthdate = new Date(dobyear+"-"+"01-01");
                if (noOfDays>=1 && noOfDays<=366){
                    gendername =  "Male";
                }else if(noOfDays>=501 && noOfDays<=866){
                    noOfDays = noOfDays-500;
                    gendername =  "Female";
                }
                if(gendername=== "Female" ||  gendername ===  "Male"){
                    fillCombo(cmbGender,"Select Gender",genders,"name",gendername);
                    birthdate.setDate(birthdate.getDate()+parseInt(noOfDays)-1)
                    dteDob.value = birthdate.getFullYear()+"-"+getmonthdate(birthdate);

                    customer.gender_id = JSON.parse(cmbGender.value);
                    customer.dob = dteDob.value;
                    customer.nic = field.value;
                    if (oldcustomer != null && oldcustomer.nic != customer.nic){
                        field.style.border=updated;}else {field.style.border=valid;}
                    if (oldcustomer != null && oldcustomer.dob != customer.dob){
                        dteDob.style.border=updated;}else {dteDob.style.border=valid;}
                    if (oldcustomer != null && oldcustomer.gender_id.name != customer.gender_id.name){
                        cmbGender.style.border=updated;}else {cmbGender.style.border=valid;}
                    dteDOBirthCH();
                }else{
                    field.style.border = invalid;
                    cmbGender.style.border = initial;
                    dteDob.style.border = initial;
                    fillCombo(cmbGender,"Select Gender",genders,"name","");
                    dteDob.value = "";
                    customer.nic = null;
                }
            }else{
                field.style.border = invalid;
                customer.nic = null;
            }

        }

        function dteDOBirthCH() {
            var today = new Date();
            var birthday = new Date(dteDob.value);
            if((today.getTime()-birthday.getTime())>(18*365*24*3600*1000)) {
                customer.dob = dteDob.value;
                dteDob.style.border = valid;
            }
            else
            {
                customer.dob = null;
                dteDob.style.border = invalid;
            }
        }

        function getCustomerErrors() {

            var errors = "";
            addvalue = "";

            if (customer.callingname == null) {
                txtCallingName.style.border = invalid;
                errors = errors + "\n" + "Calling name not Entered";
            }
            else  addvalue = 1;

            if (customer.fullname == null) {
                txtFullName.style.border = invalid;
                errors = errors + "\n" + "Full name not Entered";
            }
            else  addvalue = 1;

            if (customer.nic == null) {
                txtNIC.style.border = invalid;
                errors = errors + "\n" + "NIC not Entered";
            }
            else  addvalue = 1;

            if (customer.address == null) {
                txtCusAddress.style.border = invalid;
                errors = errors + "\n" + "Adddress Not Entered";
            }
            else  addvalue = 1;

            if (customer.mobileno == null) {
                txtMobile.style.border = invalid;
                errors = errors + "\n" + "Mobile number not Entered";
            }
            else  addvalue = 1;

            if (customer.email == null) {
                txtEmail.style.border = invalid;
                errors = errors + "\n" + "Email not Entered";
            }
            else  addvalue = 1;

            if (customer.customertype_id == null) {
                cmbCusType.style.border = invalid;
                errors = errors + "\n" + "Customer Type Not Selected";
            }
            else  addvalue = 1;

            return errors;

        }

        function btnCustomerAddMC(){
            if(getCustomerErrors()==""){
                if(txtLAnd.value=="" || txtCusDescription.value ==""){
                    swal({
                        title: "Are you sure to continue...?",
                        text: "Form has some empty fields.....",
                        icon: "warning",
                        buttons: true,
                        dangerMode: true,
                    }).then((willDelete) => {
                        if (willDelete) {
                            savedataCustomer();
                        }
                    });

                }else{
                    savedataCustomer();
                }
            }else{
                swal({
                    title: "You have following errors",
                    text: "\n"+getCustomerErrors(),
                    icon: "error",
                    button: true,
                });

            }
        }

        function savedataCustomer() {

            swal({
                title: "Are you sure to add following Customer...?" ,
                text :  "\nRegno : " + customer.regno +
                    "\nCalling name : " + customer.callingname +
                    "\nFull Name : " + customer.fullname +
                    "\nNIC : " + customer.nic +
                    "\nGender : " + customer.gender_id.name +
                    "\nDate of Birth : " + customer.dob +
                    "\nAddress : " + customer.address +
                    "\nMobile No : " + customer.mobileno +
                    "\nEmail : " + customer.email +
                    "\nCustomer Type : " + customer.customertype_id.name +
                    "\nCustomer Status : " + customer.customerstatus_id.name,
                icon: "warning",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
                    var response = httpRequest("/customer", "POST", customer);
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
                        loadCustomerForm();
                        fillcustomername();
                    }
                    else swal({
                        title: 'Save not Success... , You have following errors', icon: "error",
                        text: '\n ' + response,
                        button: true
                    });
                }
            });

        }

        function fillcustomername() {
            newcustomers = httpRequest("../customer/namelist","GET");
            fillCombo(cmbCustomerId,"Select Customer Name", newcustomers,"callingname","");

        }

        function btnCustomerClearMC() {
            //Get Cofirmation from the User window.confirm();
            checkerr = getCustomerErrors();

            if(oldcustomer == null && addvalue == ""){
                loadCustomerForm();
            }else{
                swal({
                    title: "Form has some values, updates values... Are you sure to discard the form ?",
                    text: "\n" ,
                    icon: "warning", buttons: true, dangerMode: true,
                }).then((willDelete) => {
                    if (willDelete) {
                        loadCustomerForm();
                    }

                });
            }

        }