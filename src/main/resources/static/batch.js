

 

        window.addEventListener("load", initialize);

        //Initializing Functions

        function initialize() {

            //tooltip enable
            $('[data-toggle="tooltip"]').tooltip()

            // add / clear / update buttons Event Handler
            btnAdd.addEventListener("click",btnAddMC);
            btnClear.addEventListener("click",btnClearMC);
            btnUpdate.addEventListener("click",btnUpdateMC);

            //cmbUnit.addEventListener("change",cmbUnitCH);

            txtSearchName.addEventListener("keyup",btnSearchMC);

            privilages = httpRequest("../privilage?module=BATCH","GET");
    
            items = httpRequest("../item/listitem","GET");
            batchststuses = httpRequest("../batchstatus/list","GET");
            employees = httpRequest("../employee/list","GET");

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
            batches = new Array();
          var data = httpRequest("/batch/findAll?page="+page+"&size="+size+query,"GET");
            if(data.content!= undefined) batches = data.content;
            createPagination('pagination',data.totalPages, data.number+1,paginate);
            fillTable('tblBatch',batches,fillForm,btnDeleteMC,viewitem);
            clearSelection(tblBatch);

            if(activerowno!="")selectRow(tblBatch,activerowno,active);

        }

        function paginate(page) {
            var paginate;
            if(oldbatch==null){
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

        function viewitem(bat,rowno) {

            batveiw = JSON.parse(JSON.stringify(bat));

            tdbiino.innerHTML = batveiw.batchno;
            tdsalep.innerHTML = parseFloat(batveiw.salesprice).toFixed(2);
            tdpurchasep.innerHTML = parseFloat(batveiw.purchaseprice).toFixed(2);
            tdexp.innerHTML = batveiw.expdate;
            tdmfd.innerHTML = batveiw.mfdate;
            tdavaiqty.innerHTML = batveiw.avaqty;
            tdtotqty.innerHTML = batveiw.totalqty;
            tdretqty.innerHTML = batveiw.returnqty;
            tdaddate.innerHTML = batveiw.addeddate;
            tddesc.innerHTML = batveiw.description;

            tditem.innerHTML = batveiw.item_id.itemname;
            tdasign.innerHTML = batveiw.employee_id.callingname;
            tdistatus.innerHTML = batveiw.batchstatus_id.name;

            $('#dataVeiwModal').modal('show')
         }

         function btnPrintRowMC(){

             var format = printformtable.outerHTML;

             var newwindow=window.open();
             newwindow.document.write("<html>" +
                 "<head><style type='text/css'>.google-visualization-table-th {text-align: left;}</style>" +
                 "<link rel=\'stylesheet\' href=\'resources/bootstrap/css/bootstrap.min.css\'></head>" +
                 "<body><div style='margin-top: 150px'><h1 style='text-align: center'>Dharshana Pharmacy & Grocery</h1><h2>Batch Details :</h2></div>" +
                 "<div>"+format+"</div>" +
                 "<script>printformtable.removeAttribute('style')</script>" +
                 "</body></html>");
             setTimeout(function () {newwindow.print(); newwindow.close();},100);
         }


        function loadForm() {
            batch = new Object();
            oldbatch = null;

            // fill data into combo
            // fillCombo(feildid, message, datalist, displayproperty, selected value)
            fillCombo(cmbItem,"Select Item", items,"itemname","");

            // fill and auto select / auto bind
            fillCombo(cmbStatus,"Select Status",batchststuses,"name","Available");
            fillCombo(cmbAssignBy,"Select employee",employees,"callingname",session.getObject('activeuser').employeeId.callingname);

            batch.batchstatus_id=JSON.parse(cmbStatus.value);
            cmbStatus.disabled = true;

            batch.employee_id=JSON.parse(cmbAssignBy.value);
            cmbAssignBy.disabled = true;

            dteAsignDate.value=getCurrentDateTime('date');
            batch.addeddate=dteAsignDate.value;
            dteAsignDate.disabled = true;

            // Get Next Number Form Data Base
            var nextNumber = httpRequest("/batch/nextnumber", "GET");
            txtBatchNo.value = nextNumber.batchno;
            batch.batchno = txtBatchNo.value;
            txtBatchNo.disabled="disabled";

            //textfeild empty
            cmbItem.value = "";
            txtSalePrice.value = "";
            txtPurchasePrice.value = "";
            dtExpDate.value = "";
            dtMfDate.value = "";
            txtAvailQty.value = "";
            txtTotalQty.value = "";
            txtReturnQty.value = "";
            txtDescription.value = "";

            setStyle(initial);

             cmbAssignBy.style.border=valid;
             dteAsignDate.style.border=valid;
             cmbStatus.style.border=valid;
            txtBatchNo.style.border=valid;

             disableButtons(false, true, true);

        }

        function setStyle(style) {

            txtBatchNo.style.border = style;
            cmbItem.style.border = style;
            txtSalePrice.style.border = style;
            txtPurchasePrice.style.border = style;
            dtExpDate.style.border = style;
            dtMfDate.style.border = style;
            txtAvailQty.style.border = style;
            txtTotalQty.style.border = style;
            txtReturnQty.style.border = style;
            cmbStatus.style.border = style;
            dteAsignDate.style.border = style;
            cmbAssignBy.style.border = style;
            txtDescription.style.border = style;

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
            for(index in batches){
                if(batches[index].batchstatus_id.name =="Removed"){
                    tblBatch.children[1].children[index].style.color = "#f00";
                    tblBatch.children[1].children[index].style.border = "2px solid red";
                    tblBatch.children[1].children[index].lastChild.children[1].disabled = true;
                    tblBatch.children[1].children[index].lastChild.children[1].style.cursor = "not-allowed";

                }
            }

        }

        function getErrors() {

            var errors = "";
            addvalue = "";

            if (batch.item_id == null) {
                cmbItem.style.border = invalid;
                errors = errors + "\n" + "Item not Selected";
            }
            else  addvalue = 1;

            if (batch.salesprice == null) {
                txtSalePrice.style.border = invalid;
                errors = errors + "\n" + "Sales Price not Entered";
            }
            else  addvalue = 1;

            if (batch.purchaseprice == null) {
                txtPurchasePrice.style.border = invalid;
                errors = errors + "\n" + "Purchase Price not Entered";
            }
            else  addvalue = 1;

            if (batch.expdate == null) {
                dtExpDate.style.border = invalid;
                errors = errors + "\n" + "Expire Date Entered";
            }
            else  addvalue = 1;

            if (batch.mfdate == null) {
                dtMfDate.style.border = invalid;
                errors = errors + "\n" + "MAnufactured Date Not Entered";
            }
            else  addvalue = 1;

            if (batch.avaqty == null) {
                txtAvailQty.style.border = invalid;
                errors = errors + "\n" + "Available Quantity not Entered";
            }
            else  addvalue = 1;

            if (batch.totalqty == null) {
                txtTotalQty.style.border = invalid;
                errors = errors + "\n" + "Total Quantity Entered";
            }
            else  addvalue = 1;

            if (batch.returnqty == null) {
                txtReturnQty.style.border = invalid;
                errors = errors + "\n" + "Return Quantity Not Selected";
            }
            else  addvalue = 1;

            return errors;

        }

        function btnAddMC(){
            if(getErrors()==""){
                if(txtDescription.value ==""){
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
                title: "Are you sure to add following Batch...?" ,
                  text :  "\nBatch No: " + batch.batchno +
                    "\nItem name : " + batch.item_id.itemname +
                    "\nSales Price : " + batch.salesprice +
                    "\nPurchase Price : " + batch.purchaseprice +
                    "\nExpire Date : " + batch.expdate +
                    "\nManufactered Date : " + batch.mfdate +
                    "\nAvailable Quantity : " + batch.avaqty +
                    "\nTotal Quantity : " + batch.totalqty +
                    "\nReturn Quantity : " + batch.returnqty +
                    "\nBatch Status : " + batch.batchstatus_id.name,
                icon: "warning",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
                    var response = httpRequest("/batch", "POST", batch);
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

            if(oldbatch == null && addvalue == ""){
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

        function fillForm(bat,rowno){
            activerowno = rowno;

            if (oldbatch==null) {
                filldata(bat);
            } else {
                swal({
                    title: "Form has some values, updates values... Are you sure to discard the form ?",
                    text: "\n" ,
                    icon: "warning", buttons: true, dangerMode: true,
                }).then((willDelete) => {
                    if (willDelete) {
                        filldata(bat);
                    }

                });
            }

        }

        // Re fill data into form
        function filldata(bat) {
            clearSelection(tblBatch);
            selectRow(tblBatch,activerowno,active);

            batch = JSON.parse(JSON.stringify(bat));
            oldbatch = JSON.parse(JSON.stringify(bat));

            txtBatchNo.value = batch.batchno;
            txtBatchNo.disabled="disabled";
            txtSalePrice.value = parseFloat(batch.salesprice).toFixed(2);
            txtPurchasePrice.value = parseFloat(batch.purchaseprice).toFixed(2);
            dtExpDate.value = batch.expdate;
            dtMfDate.value = batch.mfdate;
            txtAvailQty.value = batch.avaqty;
            txtTotalQty.value = batch.totalqty;
            txtReturnQty.value = batch.returnqty;
            dteAsignDate.value = batch.addeddate;
            txtDescription.value = batch.description;

            fillCombo(cmbItem,"Select Item",items,"itemname",batch.item_id.itemname);
            cmbItem.disabled = false;

            fillCombo(cmbStatus,"",batchststuses,"name",batch.batchstatus_id.name);
            cmbStatus.disabled = false;
            fillCombo(cmbAssignBy,"",employees,"callingname",batch.employee_id.callingname);

            // setDefaultFile('flePhoto', customer.photo);

            disableButtons(true, false, false);
            setStyle(valid);
            changeTab('form');

            //  optional feild
            if(batch.description == null)
                txtDescription.style.border = initial;

        }

        function getUpdates() {

            var updates = "";

            if(batch!=null && oldbatch!=null) {

                if (batch.batchno != oldbatch.batchno)
                    updates = updates + "\nBatch No is Changed " + oldbatch.batchno + " into " + batch.batchno;

                if (batch.salesprice != oldbatch.salesprice)
                    updates = updates + "\nSales Price is Changed " + oldbatch.salesprice + " into " + batch.salesprice;

                if (batch.purchaseprice != oldbatch.purchaseprice)
                    updates = updates + "\nPurchase Price is Changed " + oldbatch.purchaseprice + " into " + batch.purchaseprice;

                if (batch.expdate != oldbatch.expdate)
                    updates = updates + "\nExpire Date is Changed " + oldbatch.expdate + " into " + batch.expdate;

                if (batch.mfdate != oldbatch.mfdate)
                    updates = updates + "\nManufactured Date is Changed " + oldbatch.mfdate + " into " + batch.mfdate;

                if (batch.avaqty != oldbatch.avaqty)
                    updates = updates + "\nAvailable Quantity is Changed " + oldbatch.avaqty + " into " + batch.avaqty;

                if (batch.totalqty != oldbatch.totalqty)
                    updates = updates + "\nTotal Quantity is Changed " + oldbatch.totalqty + " into " + batch.totalqty;

                if (batch.returnqty != oldbatch.returnqty)
                    updates = updates + "\nReturn Quantity is Changed " + oldbatch.returnqty + " into " + batch.returnqty;

                if (batch.item_id.itemname != oldbatch.item_id.itemname)
                    updates = updates + "\nItem Name is Changed " + oldbatch.item_id.itemname + " into " + batch.item_id.itemname;

                if (batch.addeddate != oldbatch.addeddate)
                    updates = updates + "\nAddedd Date is Changed " + oldbatch.addeddate + " into " + batch.addeddate;

                if (batch.description != oldbatch.description)
                    updates = updates + "\nDescription is Changed " + oldbatch.description + " into " + batch.description;

                if (batch.batchstatus_id.name != oldbatch.batchstatus_id.name)
                    updates = updates + "\nBatch status is Changed " + oldbatch.batchstatus_id.name + " into " + batch.batchstatus_id.name;
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
                        title: "Are you sure to update following Batch details...?",
                        text: "\n"+ getUpdates(),
                        icon: "warning", buttons: true, dangerMode: true,
                    })
                        .then((willDelete) => {
                        if (willDelete) {
                            var response = httpRequest("/batch", "PUT", batch);
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
                                    text: 'You ave following error \n '+response,
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

        function btnDeleteMC(bat) {
            batch = JSON.parse(JSON.stringify(bat));

            swal({
                title: "Are you sure to delete following Batch...?",
                text: "\n Batch No : " + batch.batchno +
                "\n Item Name : " + batch.item_id.itemname,
                icon: "warning", buttons: true, dangerMode: true,
            }).then((willDelete)=> {
                if (willDelete) {
                    var responce = httpRequest("/batch","DELETE",batch);
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
            formattab = tblBatch.outerHTML;

           newwindow.document.write("" +
                "<html>" +
                "<head><style type='text/css'>.google-visualization-table-th {text-align: left;} .modifybutton{display: none} .isort{display: none}</style>" +
                "<link rel='stylesheet' href='../resources/bootstrap/css/bootstrap.min.css'/></head>" +
                "<body><div style='margin-top: 150px; '> <h1>Batch Details : </h1></div>" +
                "<div>"+ formattab+"</div>"+
               "</body>" +
                "</html>");
           setTimeout(function () {newwindow.print(); newwindow.close();},100) ;
        }

        function sortTable(cind) {
            cindex = cind;

         var cprop = tblCustomer.firstChild.firstChild.children[cindex].getAttribute('property');

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
            fillTable('tblItem',items,fillForm,btnDeleteMC,viewitem);
            clearSelection(tblCustomer);
            loadForm();

            if(activerowno!="")selectRow(tblCustomer,activerowno,active);



        }