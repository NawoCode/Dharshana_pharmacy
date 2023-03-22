

 

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

            privilages = httpRequest("../privilage?module=CUSTOMER","GET");
    
            customertypes = httpRequest("../customertype/list","GET");
            customerststuses = httpRequest("../customerstatus/list","GET");
            genders = httpRequest("../gender/list","GET");
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
            customers = new Array();
          var data = httpRequest("/customer/findAll?page="+page+"&size="+size+query,"GET");
            if(data.content!= undefined) customers = data.content;
            createPagination('pagination',data.totalPages, data.number+1,paginate);
            fillTable('tblCustomer',customers,fillForm,btnDeleteMC,viewitem);
            clearSelection(tblCustomer);

            if(activerowno!="")selectRow(tblCustomer,activerowno,active);

        }

        function paginate(page) {
            var paginate;
            if(oldcustomer==null){
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

        function viewitem(cus,rowno) {

            customer = JSON.parse(JSON.stringify(cus));

            tdcregno.innerHTML = customer.regno;
            tdccnme.innerHTML = customer.callingname;
            tdcfname.innerHTML = customer.fullname;
            tdnic.innerHTML = customer.nic;
            tddob.innerHTML = customer.dob;
            tdaddress.innerHTML = customer.address;
            tdmobilno.innerHTML = customer.mobileno;
            tdemail.innerHTML = customer.email;
            tdlandno.innerHTML = customer.secondcontactno;
            tdaddate.innerHTML = customer.addeddate;
            tddesc.innerHTML = customer.description;

            tdgender.innerHTML = customer.gender_id.name;
            tdasign.innerHTML = customer.employee_id.callingname;
            tdctype.innerHTML = customer.customertype_id.name;
            tdistatus.innerHTML = customer.customerstatus_id.name;

            $('#dataVeiwModal').modal('show')


         }

         function btnPrintRowMC(){

             var format = printformtable.outerHTML;

             var newwindow=window.open();
             newwindow.document.write("<html>" +
                 "<head><style type='text/css'>.google-visualization-table-th {text-align: left;}</style>" +
                 "<link rel=\'stylesheet\' href=\'resources/bootstrap/css/bootstrap.min.css\'></head>" +
                 "<body><div style='margin-top: 150px'><h1 style='text-align: center'>Dharshana Pharmacy & Grocery</h1><h2>Customer Details :</h2></div>" +
                 "<div>"+format+"</div>" +
                 "<script>printformtable.removeAttribute('style')</script>" +
                 "</body></html>");
             setTimeout(function () {newwindow.print(); newwindow.close();},100);
         }


        function loadForm() {
            customer = new Object();
            oldcustomer = null;

            // fill data into combo
            // fillCombo(feildid, message, datalist, displayproperty, selected value)
             fillCombo(cmbCusType,"Select Customer Type", customertypes,"name","");
             fillCombo(cmbGender,"Select Gender",genders,"name","");

             // fill and auto select / auto bind
             fillCombo(cmbStatus,"",customerststuses,"name","Available");
             fillCombo(cmbAssignBy,"",employees,"callingname",session.getObject('activeuser').employeeId.callingname);

             customer.customerstatus_id=JSON.parse(cmbStatus.value);
            cmbStatus.disabled = true;

            customer.employee_id=JSON.parse(cmbAssignBy.value);
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

            setStyle(initial);

             cmbAssignBy.style.border=valid;
             dteAsignDate.style.border=valid;
             cmbStatus.style.border=valid;
             txtRegNo.style.border=valid;

             disableButtons(false, true, true);

        }

        function setStyle(style) {

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
            for(index in customers){
                if(customers[index].customerstatus_id.name =="Removed"){
                    tblCustomer.children[1].children[index].style.color = "#f00";
                    tblCustomer.children[1].children[index].style.border = "2px solid red";
                    tblCustomer.children[1].children[index].lastChild.children[1].disabled = true;
                    tblCustomer.children[1].children[index].lastChild.children[1].style.cursor = "not-allowed";

                }
            }

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

        function nicFieldBinder(field,pattern,ob,prop,oldob) {
            var regpattern = new RegExp(pattern);

            var val = field.value.trim();
            if (regpattern.test(val)) {
                customer.nic = val;
                if (oldcustomer != null && oldcustomer.nic != customer.nic){
                    field.style.border = updated;
                    gender = generate(val,field,cmbGender,dteDob);
                    fillCombo(cmbGender,"Select Gender",genders,"name",gender);
                    cmbGender.style.border=updated;
                    dteDob.style.border=updated;
                    customer.gender_id = JSON.parse(cmbGender.value);
                    customer.dob = dteDob.value;
                }else{
                    field.style.border = valid;
                    gender =  generate(val,field,cmbGender,dteDob);
                    fillCombo(cmbGender,"Select Gender",genders,"name",gender);
                    cmbGender.style.border=valid;
                    dteDob.style.border=valid;
                    customer.gender_id = JSON.parse(cmbGender.value);
                    customer.dob = dteDob.value;
                }
            }
            else {
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


        function getErrors() {

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

        function btnAddMC(){
            if(getErrors()==""){
                if(txtLAnd.value=="" || txtCusDescription.value ==""){
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

            if(oldcustomer == null && addvalue == ""){
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

        function fillForm(cus,rowno){
            activerowno = rowno;

            if (oldcustomer==null) {
                filldata(cus);
            } else {
                swal({
                    title: "Form has some values, updates values... Are you sure to discard the form ?",
                    text: "\n" ,
                    icon: "warning", buttons: true, dangerMode: true,
                }).then((willDelete) => {
                    if (willDelete) {
                        filldata(cus);
                    }

                });
            }

        }

        // Re fill data into form
        function filldata(cus) {
            clearSelection(tblCustomer);
            selectRow(tblCustomer,activerowno,active);

            customer = JSON.parse(JSON.stringify(cus));
            oldcustomer = JSON.parse(JSON.stringify(cus));

            txtRegNo.value = customer.regno;
            txtRegNo.disabled="disabled";
            txtCallingName.value = customer.callingname;
            txtFullName.value = customer.fullname;
            txtNIC.value = customer.nic;
            dteDob.value = customer.dob;
            txtCusAddress.value = customer.address;
            txtMobile.value = customer.mobileno;
            txtEmail.value = customer.email;
            dteAsignDate.value = customer.addeddate;
            txtCusDescription.value = customer.description;
            txtLAnd.value = customer.secondcontactno;

            fillCombo(cmbGender,"Select Gender",genders,"name",customer.gender_id.name);
            fillCombo(cmbCusType,"Select Customer Type",customertypes,"name",customer.customertype_id.name);

            fillCombo(cmbStatus,"",customerststuses,"name",customer.customerstatus_id.name);
            cmbStatus.disabled = false;
            fillCombo(cmbAssignBy,"",employees,"callingname",customer.employee_id.callingname);

            // setDefaultFile('flePhoto', customer.photo);

            disableButtons(true, false, false);
            setStyle(valid);
            changeTab('form');

            //  optional feild
            if(customer.description == null)
                txtCusDescription.style.border = initial;

            if(customer.secondcontactno == null)
                txtLAnd.style.border = initial;
        }

        function getUpdates() {

            var updates = "";

            if(customer!=null && oldcustomer!=null) {

                if (customer.regno != oldcustomer.regno)
                    updates = updates + "\nCustomer Regno is Changed " + oldcustomer.regno + " into " + customer.regno;

                if (customer.callingname != oldcustomer.callingname)
                    updates = updates + "\nCalling Name is Changed " + oldcustomer.callingname + " into " + customer.callingname;

                if (customer.fullname != oldcustomer.fullname)
                    updates = updates + "\nCustomer Fullname is Changed " + oldcustomer.fullname + " into " + customer.fullname;

                if (customer.nic != oldcustomer.nic)
                    updates = updates + "\nNIC is Changed " + oldcustomer.nic + " into " + customer.nic;

                if (customer.dob != oldcustomer.dob)
                    updates = updates + "\nDate of Birth is Changed " + oldcustomer.dob + " into " + customer.dob;

                if (customer.gender_id.name != oldcustomer.gender_id.name)
                    updates = updates + "\nGender is Changed " + oldcustomer.gender_id.name + " into " + customer.gender_id.name;

                if (customer.address != oldcustomer.address)
                    updates = updates + "\nAddress is Changed " + oldcustomer.address + " into " + customer.address;

                if (customer.mobileno != oldcustomer.mobileno)
                    updates = updates + "\nMobile No is Changed " + oldcustomer.mobileno + " into " + customer.mobileno;

                if (customer.secondcontactno != oldcustomer.secondcontactno)
                    updates = updates + "\nLand No is Changed " + oldcustomer.secondcontactno + " into " + customer.secondcontactno;

                if (customer.email != oldcustomer.email)
                    updates = updates + "\nEmail is Changed " + oldcustomer.email + " into " + customer.email;

                if (customer.customertype_id.name != oldcustomer.customertype_id.name)
                    updates = updates + "\nCustomer Type is Changed " + oldcustomer.customertype_id.name + " into " + customer.customertype_id.name;

                if (customer.addeddate != oldcustomer.addeddate)
                    updates = updates + "\nAddedd Date is Changed " + oldcustomer.addeddate + " into " + customer.addeddate;

                if (customer.description != oldcustomer.description)
                    updates = updates + "\nDescription is Changed " + oldcustomer.description + " into " + customer.description;

                if (customer.customerstatus_id.name != oldcustomer.customerstatus_id.name)
                    updates = updates + "\nCustomerstatus is Changed " + oldcustomer.customerstatus_id.name + " into " + customer.customerstatus_id.name;
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
                        title: "Are you sure to update following Customer details...?",
                        text: "\n"+ getUpdates(),
                        icon: "warning", buttons: true, dangerMode: true,
                    })
                        .then((willDelete) => {
                        if (willDelete) {
                            var response = httpRequest("/customer", "PUT", customer);
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

        function btnDeleteMC(cus) {
            customer = JSON.parse(JSON.stringify(cus));

            swal({
                title: "Are you sure to delete following Customer...?",
                text: "\n Regno : " + customer.regno +
                "\n Callingname Name : " + customer.callingname,
                icon: "warning", buttons: true, dangerMode: true,
            }).then((willDelete)=> {
                if (willDelete) {
                    var responce = httpRequest("/customer","DELETE",customer);
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
            formattab = tblCustomer.outerHTML;

           newwindow.document.write("" +
                "<html>" +
                "<head><style type='text/css'>.google-visualization-table-th {text-align: left;} .modifybutton{display: none} .isort{display: none}</style>" +
                "<link rel='stylesheet' href='../resources/bootstrap/css/bootstrap.min.css'/></head>" +
                "<body><div style='margin-top: 150px; '> <h1>Items Details : </h1></div>" +
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