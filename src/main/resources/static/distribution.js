

 

        window.addEventListener("load", initialize);

        //Initializing Functions

        function initialize() {

            //tooltip enable
            $('[data-toggle="tooltip"]').tooltip()

            // add / clear / update buttons Event Handler
            btnAdd.addEventListener("click",btnAddMC);
            btnClear.addEventListener("click",btnClearMC);
            btnUpdate.addEventListener("click",btnUpdateMC);

            txtSearchName.addEventListener("keyup",btnSearchMC);

            privilages = httpRequest("../privilage?module=DISTRIBUTION","GET");

            vehicles = httpRequest("../vehicle/list","GET");
            drivers = httpRequest("../employee/list","GET");
            disrtibutionstatuses = httpRequest("../distributionstatus/list","GET");
            employees = httpRequest("../employee/list","GET");

            //Data list for inner fillcombo box
            invoices = httpRequest("../invoice/listdeliverytrue","GET");

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
            distributions = new Array();
          var data = httpRequest("/distribution/findAll?page="+page+"&size="+size+query,"GET");
            if(data.content!= undefined) distributions = data.content;
            createPagination('pagination',data.totalPages, data.number+1,paginate);
            fillTable('tblDistribution',distributions,fillForm,btnDeleteMC,viewitem);
            clearSelection(tblDistribution);

            if(activerowno!="")selectRow(tblDistribution,activerowno,active);

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

        function viewitem(dis,rowno) {

            disview = JSON.parse(JSON.stringify(dis));

            tdDcode.innerHTML = disview.distributioncode;
            tdvehicle.innerHTML = disview.vehicle_id.vehicleno;
            tddriver.innerHTML = disview.demployee_id.callingname;
            tddtDeliverDt.innerHTML = disview.deliverydate;

            fillInnerTable("tblPrintInnerDrugItem",disview.distributionHasInvoiceList,innerModify, innerDelete, innerVeiw);

            tdasign.innerHTML = disview.employee_id.callingname;
            tdaddate.innerHTML = disview.addeddate;
            tdpstatus.innerHTML = disview.distributionstatus_id.name;
            tddesc.innerHTML = disview.description;

            $('#dataVeiwModal').modal('show')


         }

         function btnPrintRowMC(){

             var format = printformtable.outerHTML;

             var newwindow=window.open();
             newwindow.document.write("<html>" +
                 "<head><style type='text/css'>.google-visualization-table-th {text-align: left;}</style>" +
                 "<link rel=\'stylesheet\' href=\'resources/bootstrap/css/bootstrap.min.css\'></head>" +
                 "<body><div style='margin-top: 150px'><h1 style='text-align: center'>Dharshana Pharmacy & Grocery</h1><h2>Distribution Details :</h2></div>" +
                 "<div>"+format+"</div>" +
                 "<script>printformtable.removeAttribute('style')</script>" +
                 "</body></html>");
             setTimeout(function () {newwindow.print(); newwindow.close();},100);
         }

        function loadForm() {

            distribution = new Object();
            olddistribution = null;

            //create new array
            distribution.distributionHasInvoiceList = new Array();

            // fill data into combo
            // fillCombo(feildid, message, datalist, displayproperty, selected value)
             fillCombo(cmbVehicleId,"Select Vehicle No", vehicles,"vehicleno","");
             fillCombo(cmbDriverName,"Select Driver Name", drivers,"callingname","");

             // fill and auto select / auto bind
             fillCombo(cmbStatus,"",disrtibutionstatuses,"name","Available");
             fillCombo(cmbAssignBy,"",employees,"callingname",session.getObject('activeuser').employeeId.callingname);

            distribution.distributionstatus_id=JSON.parse(cmbStatus.value);
            cmbStatus.disabled = true;

            distribution.employee_id=JSON.parse(cmbAssignBy.value);
            cmbAssignBy.disabled = true;

            dteAddedDate.value=getCurrentDateTime('date');;
            distribution.addeddate=dteAddedDate.value;
            dteAddedDate.disabled = true;

            // Get Next Number Form Data Base
            var nextNumber = httpRequest("/distribution/nextnumber", "GET");
            txtDistributionCode.value = nextNumber.distributioncode;
            distribution.distributioncode = txtDistributionCode.value;
            txtDistributionCode.disabled=true;

            //textfeild empty
            cmbVehicleId.value ="";
            cmbDriverName.value ="";
            dteDeliveryDate.value ="";
            txtDescription.value ="";


            dteDeliveryDate.value = "";
            //set min date for require date
            dteDeliveryDate.min = getCurrentDateTime('date');
            //set max date for require date
            dteDeliveryDate.max = maxAndMinDate('max',dteAddedDate,7);

             setStyle(initial);

            txtDistributionCode.style.border=valid;
            dteAddedDate.style.border=valid;
            cmbStatus.style.border=valid;
            cmbAssignBy.style.border=valid;

             disableButtons(false, true, true);

             refreshInner();
        }

        function setStyle(style) {

            txtDistributionCode.style.border = style;
            cmbVehicleId.style.border = style;
            cmbDriverName.style.border = style;
            dteDeliveryDate.style.border = style;
            txtDescription.style.border = style;
            cmbStatus.style.border = style;
            dteAddedDate.style.border = style;
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
            for(index in distributions){
                if(distributions[index].distributionstatus_id.name =="Removed"){
                    tblDistribution.children[1].children[index].style.color = "#f00";
                    tblDistribution.children[1].children[index].style.border = "2px solid red";
                    tblDistribution.children[1].children[index].lastChild.children[1].disabled = true;
                    tblDistribution.children[1].children[index].lastChild.children[1].style.cursor = "not-allowed";

                }
            }

        }

        function refreshInner() {
            distributionHAsInvoice = new Object();
            olddistributionHAsInvoice = null;

            btnInnerUpdate.disabled = true;
            btnInnerAdd.disabled = false;

            fillCombo(cmbInvoice,"Select Invoice No", invoices,"invoiceno","");

            cmbInvoice.style.border=initial;

            chDeliver.checked = false;
            $('#chDeliver').bootstrapToggle('off')
            distributionHAsInvoice.delivered = false;

            // Inner Table
            fillInnerTable("tblInnerDrug",distribution.distributionHasInvoiceList,innerModify, innerDelete, true);
            if(distribution.distributionHasInvoiceList.length != 0){
                for (var index in distribution.distributionHasInvoiceList){
                    //tblInnerDrug.children[1].children[index].lastChild.children[0].style.display= "none";
                }
            }
        }

        function btnInnerAddMc() {

            var itnext = false;
            for(var index in distribution.distributionHasInvoiceList){
                if (distribution.distributionHasInvoiceList[index].invoice_id.invoiceno == distributionHAsInvoice.invoice_id.invoiceno ){
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
                distribution.distributionHasInvoiceList.push(distributionHAsInvoice);
                refreshInner();
            }
        }

        function btnInnerClearMc() {
            if(distributionHAsInvoice.invoice_id != null){
                swal({
                    title: "Are you sure to cler innerform?",
                    text: "\n",
                    icon: "warning", buttons: true, dangerMode: true,
                }).then((willDelete) => {
                    if (willDelete) {
                        refreshInner();
                    }
                });
            }else {
                refreshInner();
            }
        }

        function innerModify(ob, innerrowno) {
            innerrow = innerrowno;
            distributionHAsInvoice = ob;

            btnInnerUpdate.disabled = false;
            btnInnerAdd.disabled = true;

            $('#collapseOne').collapse('show');

            fillCombo(cmbInvoice,"Select Invoice No", invoices,"invoiceno",distributionHAsInvoice.invoice_id.invoiceno);
            cmbInvoice.disabled = true;

            if(distributionHAsInvoice.delivered==true){
                chDeliver.checked = true;
                $('#chDeliver').bootstrapToggle('on')
            }else {
                chDeliver.checked = false;
                $('#chDeliver').bootstrapToggle('off')
            }

        }

        function btnInnerUpdateMc() {
            distribution.distributionHasInvoiceList[innerrow] = distributionHAsInvoice;
            swal({
                title: 'Updated...!',icon: "warning",
                text: '\n',
                button: false,
                timer: 1200});
            refreshInner();
            cmbInvoice.disabled = false;

        }

        function innerDelete(innerob,innerrow) {

                swal({
                    title: "Are you sure to delete invoice?",
                    text: "\n" +
                        "Invoice No : " + innerob.invoice_id.invoiceno,
                    icon: "warning", buttons: true, dangerMode: true,
                }).then((willDelete) => {
                    if (willDelete) {
                        distribution.distributionHasInvoiceList.splice(innerrow,1);
                        refreshInner();
                    }
                });
        }

        function innerVeiw() {}

        function getErrors() {

            var errors = "";
            addvalue = "";

            if (distribution.vehicle_id == null) {
                cmbVehicleId.style.border = invalid;
                errors = errors + "\n" + "Vehicle No Not Selected";
            }
            else  addvalue = 1;

            if (distribution.demployee_id == null) {
                cmbDriverName.style.border = invalid;
                errors = errors + "\n" + "Driver Name Not Selected";
            }
            else  addvalue = 1;

            if (distribution.deliverydate == null) {
                dteDeliveryDate.style.border = invalid;
                errors = errors + "\n" + "Deliver Date Not Entered";
            }
            else  addvalue = 1;


            if (distribution.distributionHasInvoiceList.length == 0 ) {
                cmbInvoice.style.border = invalid;
                errors = errors + "\n" + "Invoice No Not Added";
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
                title: "Are you sure to add following Destribution Deteils...?" ,
                  text :  "\nDistribution Code : " + distribution.distributioncode +
                    "\nCustomer Name : " + distribution.vehicle_id.vehicleno +
                    "\nCustomer Name : " + distribution.demployee_id.callingname +
                    "\nRequire Date : " + distribution.deliverydate +
                    "\ndistribution Status : " + distribution.distributionstatus_id.name,
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
                    var response = httpRequest("/distribution", "POST", distribution);
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

            if(distribution == null && addvalue == ""){
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

        function fillForm(dis,rowno){
            activerowno = rowno;

            if (olddistribution==null) {
                filldata(dis);
            } else {
                swal({
                    title: "Form has some values, updates values... Are you sure to discard the form ?",
                    text: "\n" ,
                    icon: "warning", buttons: true, dangerMode: true,
                }).then((willDelete) => {
                    if (willDelete) {
                        filldata(dis);
                    }

                });
            }

        }

        // Re fill data into form
        function filldata(dis) {
            clearSelection(tblDistribution);
            selectRow(tblDistribution,activerowno,active);

            distribution = JSON.parse(JSON.stringify(dis));
            olddistribution = JSON.parse(JSON.stringify(dis));

            txtDistributionCode.value = distribution.distributioncode;
            txtDistributionCode.disabled="disabled";
            dteDeliveryDate.value = distribution.deliverydate;
            dateUpdateFill('max',dteDeliveryDate,'distribution','deliverydate','olddistribution',7,'addeddate');
            txtDescription.value = distribution.description;
            dteAddedDate.value = distribution.addeddate;

            fillCombo(cmbVehicleId,"Select Vehicle No", vehicles,"vehicleno",distribution.vehicle_id.vehicleno);
            fillCombo(cmbDriverName,"Select Driver Name", drivers,"callingname",distribution.demployee_id.callingname);

            //innerform
            refreshInner();
            $('#collapseTwo').collapse('show')

            fillCombo(cmbStatus,"",disrtibutionstatuses,"name",distribution.distributionstatus_id.name);
            cmbStatus.disabled = false;
            fillCombo(cmbAssignBy,"",employees,"callingname",distribution.employee_id.callingname);

            disableButtons(true, false, false);
            setStyle(valid);
            changeTab('form');

            //  optional feild
            if(distribution.description == null)
                txtDescription.style.border = initial;
        }

        function getUpdates() {

            var updates = "";

            if(distribution!=null && olddistribution!=null) {

                if (distribution.distributioncode != olddistribution.distributioncode)
                    updates = updates + "\nDistribution Code is Changed " + olddistribution.distributioncode + " into " + distribution.distributioncode;

                if (distribution.vehicle_id.vehicleno != olddistribution.vehicle_id.vehicleno)
                    updates = updates + "\nVehicle No is Changed " + olddistribution.vehicle_id.vehicleno + " into " + distribution.vehicle_id.vehicleno;

                if (distribution.demployee_id.callingname != olddistribution.demployee_id.callingname)
                    updates = updates + "\nDriver Name is Changed " + olddistribution.demployee_id.callingname + " into " + distribution.demployee_id.callingname;

                if (distribution.deliverydate != olddistribution.deliverydate)
                    updates = updates + "\nDeliver Date is Changed " + olddistribution.deliverydate + " into " + distribution.deliverydate;

                if (distribution.description != olddistribution.description)
                    updates = updates + "\nDescription is Changed " + olddistribution.description + " into " + distribution.description;

                if (distribution.distributionstatus_id.name != olddistribution.distributionstatus_id.name)
                    updates = updates + "\nDistribution status is Changed " + olddistribution.distributionstatus_id.name + " into " + distribution.distributionstatus_id.name;
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
                        title: "Are you sure to update following Didtribution details...?",
                        text: "\n"+ getUpdates(),
                        icon: "warning", buttons: true, dangerMode: true,
                    })
                        .then((willDelete) => {
                        if (willDelete) {
                            var response = httpRequest("/distribution", "PUT", distribution);
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

        function btnDeleteMC(dis) {
            distribution = JSON.parse(JSON.stringify(dis));

            swal({
                title: "Are you sure to delete following Distribution...?",
                text: "\nCorder Code : " + distribution.distributioncode,
                icon: "warning", buttons: true, dangerMode: true,
            }).then((willDelete)=> {
                if (willDelete) {
                    var responce = httpRequest("/distribution","DELETE",distribution);
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
            formattab = tblDistribution.outerHTML;

           newwindow.document.write("" +
                "<html>" +
                "<head><style type='text/css'>.google-visualization-table-th {text-align: left;} .modifybutton{display: none} .isort{display: none}</style>" +
                "<link rel='stylesheet' href='../resources/bootstrap/css/bootstrap.min.css'/></head>" +
                "<body><div style='margin-top: 150px; '> <h1>Distribution Details : </h1></div>" +
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