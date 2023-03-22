

 

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

            privilages = httpRequest("../privilage?module=VEHICLE","GET");
    
            vtypes = httpRequest("../vtype/list","GET");
            vstatuses = httpRequest("../vstatus/list","GET");
            employees = httpRequest("../employee/list","GET");

            valid = "2px solid green";
            invalid = "2px solid red";
            initial = "2px solid #d6d6c2";
            updated = "2px solid #ff9900";
            active = "#ff9900";

            loadView();
            loadForm();

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
            vehicles = new Array();
          var data = httpRequest("/vehicle/findAll?page="+page+"&size="+size+query,"GET");
            if(data.content!= undefined) vehicles = data.content;
            createPagination('pagination',data.totalPages, data.number+1,paginate);


            fillTable('tblVehicle',vehicles,fillForm,btnDeleteMC,viewitem);
            clearSelection(tblVehicle);

            if(activerowno!="")selectRow(tblVehicle,activerowno,active);

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

        function viewitem(veh,rowno) {

            vehveiw = JSON.parse(JSON.stringify(veh));

            tdvehicleno.innerHTML = vehveiw.vehicleno;
            tdvehname.innerHTML = vehveiw.vehiclename;
            tddesc.innerHTML = vehveiw.description;
            tdaddate.innerHTML = vehveiw.addeddate;
            tdasign.innerHTML = vehveiw.employee_id.callingname;
            tdvehtype.innerHTML = vehveiw.vtype_id.name;
            tdisstatus.innerHTML = vehveiw.vstatus_id.name;

            $('#dataVeiwModal').modal('show')


         }

         function btnPrintRowMC(){

             var format = printformtable.outerHTML;

             var newwindow=window.open();
             newwindow.document.write("<html>" +
                 "<head><style type='text/css'>.google-visualization-table-th {text-align: left;}</style>" +
                 "<link rel=\'stylesheet\' href=\'resources/bootstrap/css/bootstrap.min.css\'></head>" +
                 "<body><div style='margin-top: 150px'><h1 style='text-align: center'>Dharshana Pharmacy & Grocery</h1><h2>Vehiicle Details :</h2></div>" +
                 "<div>"+format+"</div>" +
                 "<script>printformtable.removeAttribute('style')</script>" +
                 "</body></html>");
             setTimeout(function () {newwindow.print(); newwindow.close();},100);
         }

        function loadForm() {
            vehicle = new Object();
            oldvehicle = null;

            // fill data into combo
            // fillCombo(feildid, message, datalist, displayproperty, selected value)
             fillCombo(cmbVtype,"Select Vehicle Type",vtypes,"name","");

             // fill and auto select / auto bind
             fillCombo(cmbStatus,"",vstatuses,"name","Available");
             fillCombo(cmbAssignBy,"",employees,"callingname",session.getObject('activeuser').employeeId.callingname);

            vehicle.vstatus_id=JSON.parse(cmbStatus.value);
            cmbStatus.disabled = true;

            vehicle.employee_id=JSON.parse(cmbAssignBy.value);
            cmbAssignBy.disabled = true;

            dteAsignDate.value=getCurrentDateTime('date');
            vehicle.addeddate=dteAsignDate.value;
            dteAsignDate.disabled = true;

            //textfeild empty
            txtVehicleNo.value = "";
            txtVehicleName.value = "";
            cmbVtype.value = "";
            txtDescription.value = "";

            setStyle(initial);

            cmbAssignBy.style.border=valid;
            dteAsignDate.style.border=valid;
            cmbStatus.style.border=valid;

             disableButtons(false, true, true);

        }

        function setStyle(style) {

            txtVehicleNo.style.border = style;
            txtVehicleName.style.border = style;
            cmbVtype.style.border = style;
            cmbStatus.style.border = style;
            txtDescription.style.border = style;
            cmbAssignBy.style.border = style;
            dteAsignDate.style.border = style;


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
            for(index in vehicles){
                if(vehicles[index].vstatus_id.name =="Removed"){
                    tblVehicle.children[1].children[index].style.color = "#f00";
                    tblVehicle.children[1].children[index].style.border = "2px solid red";
                    tblVehicle.children[1].children[index].lastChild.children[1].disabled = true;
                    tblVehicle.children[1].children[index].lastChild.children[1].style.cursor = "not-allowed";

                }
            }

        }


        function getErrors() {

            var errors = "";
            addvalue = "";

            if (vehicle.vehiclename == null) {
                txtVehicleName.style.border = invalid;
                errors = errors + "\n" + "Vehicle Name not entered";
            }
            else  addvalue = 1;

            if (vehicle.vtype_id == null) {
                cmbVtype.style.border = invalid;
                errors = errors + "\n" + "Vehicle Type Not Selected";
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
                title: "Are you sure to add following Vehicle...?" ,
                  text :  "\nVehicle No : " + vehicle.vehicleno +
                    "\nVehicle name : " + vehicle.vehiclename +
                    "\nPackage Type : " + vehicle.vtype_id.name +
                    "\nVehicle status : " + vehicle.vstatus_id.name +
                    "\nDescription : " + vehicle.description ,
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
                    var response = httpRequest("/vehicle", "POST", vehicle);
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

            if(oldvehicle == null && addvalue == ""){
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

        function fillForm(veh,rowno){
            activerowno = rowno;

            if (oldvehicle==null) {
                filldata(veh);
            } else {
                swal({
                    title: "Form has some values, updates values... Are you sure to discard the form ?",
                    text: "\n" ,
                    icon: "warning", buttons: true, dangerMode: true,
                }).then((willDelete) => {
                    if (willDelete) {
                        filldata(veh);
                    }

                });
            }

        }

        // Re fill data into form
        function filldata(veh) {
            clearSelection(tblVehicle);
            selectRow(tblVehicle,activerowno,active);

            vehicle = JSON.parse(JSON.stringify(veh));
            oldvehicle = JSON.parse(JSON.stringify(veh));

            txtVehicleNo.value = vehicle.vehicleno;
            //txtVehicleNo.disabled="disabled";
            txtVehicleName.value = vehicle.vehiclename;
            dteAsignDate.value = vehicle.addeddate;
            txtDescription.value = vehicle.description;

            fillCombo(cmbVtype,"Select Vehicle Type",vtypes,"name",vehicle.vtype_id.name);
            fillCombo(cmbStatus,"",vstatuses,"name",vehicle.vstatus_id.name);
            cmbStatus.disabled = false;
            fillCombo(cmbAssignBy,"",employees,"callingname",vehicle.employee_id.callingname);

            // setDefaultFile('flePhoto', item.photo);

            disableButtons(true, false, false);
            setStyle(valid);

            //  optional feild
            if(vehicle.description == null)
                txtDescription.style.border = initial;

        }

        function getUpdates() {

            var updates = "";

            if(vehicle!=null && oldvehicle!=null) {

                if (vehicle.vehicleno != oldvehicle.vehicleno)
                    updates = updates + "\nVehicle No is Changed " + oldvehicle.vehicleno + " into " + vehicle.vehicleno;

                if (vehicle.vehiclename != oldvehicle.vehiclename)
                    updates = updates + "\nVehicle Name is Changed " + oldvehicle.vehiclename + " into " + vehicle.vehiclename;

                if (vehicle.vtype_id.name != oldvehicle.vtype_id.name)
                    updates = updates + "\nVehicle Type is Changed " + oldvehicle.vtype_id.name + " into " + vehicle.vtype_id.name;

                if (vehicle.addeddate != oldvehicle.addeddate)
                    updates = updates + "\nAddedd Date is Changed " + oldvehicle.addeddate + " into " + vehicle.addeddate;

                if (vehicle.description != oldvehicle.description)
                    updates = updates + "\nDescription is Changed " + oldvehicle.description + " into " + vehicle.description;

                if (vehicle.vstatus_id.name != oldvehicle.vstatus_id.name)
                    updates = updates + "\nVehicle status is Changed " + oldvehicle.vstatus_id.name + " into " + vehicle.vstatus_id.name;
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
                        title: "Are you sure to update following Vehicle details...?",
                        text: "\n"+ getUpdates(),
                        icon: "warning", buttons: true, dangerMode: true,
                    })
                        .then((willDelete) => {
                        if (willDelete) {
                            var response = httpRequest("/vehicle", "PUT", vehicle);
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

        function btnDeleteMC(veh) {
            vehicle = JSON.parse(JSON.stringify(veh));

            swal({
                title: "Are you sure to delete following Vehhicle...?",
                text: "\n Vehicle No : " + vehicle.vehicleno,
                icon: "warning", buttons: true, dangerMode: true,
            }).then((willDelete)=> {
                if (willDelete) {
                    var responce = httpRequest("/vehicle","DELETE",vehicle);
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

       function btnPrintTableMC(sitem) {

            var newwindow = window.open();
            formattab = tblVehicle.outerHTML;

           newwindow.document.write("" +
                "<html>" +
                "<head><style type='text/css'>.google-visualization-table-th {text-align: left;} .modifybutton{display: none} .isort{display: none}</style>" +
                "<link rel='stylesheet' href='../resources/bootstrap/css/bootstrap.min.css'/></head>" +
                "<body><div style='margin-top: 150px; '> <h1>Vehicle Details : </h1></div>" +
                "<div>"+ formattab+"</div>"+
               "</body>" +
                "</html>");
           setTimeout(function () {newwindow.print(); newwindow.close();},100) ;
        }

        function sortTable(cind) {
            cindex = cind;

         var cprop = tblSubItem.firstChild.firstChild.children[cindex].getAttribute('property');

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
            fillTable('tblSubItem',items,fillForm,btnDeleteMC,viewitem);
            clearSelection(tblSubItem);
            loadForm();

            if(activerowno!="")selectRow(tblSubItem,activerowno,active);



        }