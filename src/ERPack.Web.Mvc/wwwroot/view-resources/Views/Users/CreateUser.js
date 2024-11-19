/*const { debug } = require("util");*/

(function ($) {
    let _userService = abp.services.app.user,
        l = abp.localization.getSource('ERPack'),
        _$modal = $('#DepartmentCreateModal'),
        _$form = $('#userCreateForm');

    $.validator.addMethod("indianPincode", function (value, element) {
        return this.optional(element) || /^\d{6}$/.test(value);
    }, "");

    $.validator.addMethod("AadhaarNumber", function (value, element) {
        return this.optional(element) || /^\d{12}$/.test(value);
    }, "");

    $.validator.addMethod("pastDate", function (value, element) {
        const date = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set time to midnight for comparison
        return this.optional(element) || date < today;
    }, "Please enter a date in the past.");


   
    document.addEventListener('DOMContentLoaded', function () {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
        var yyyy = today.getFullYear();

        today = yyyy + '-' + mm + '-' + dd;
        document.getElementById('DOB').setAttribute('max', today);
    });

    $('#eyepass').click(function () {

        if ($(this).hasClass('fa-eye-slash')) {

            $(this).removeClass('fa-eye-slash');

            $(this).addClass('fa-eye');

            $('#Password').attr('type', 'text');

        } else {

            $(this).removeClass('fa-eye');

            $(this).addClass('fa-eye-slash');

            $('#Password').attr('type', 'password');
        }
    });

    $('#eyeconpass').click(function () {

        if ($(this).hasClass('fa-eye-slash')) {

            $(this).removeClass('fa-eye-slash');

            $(this).addClass('fa-eye');

            $('#ConfirmPassword').attr('type', 'text');

        } else {

            $(this).removeClass('fa-eye');

            $(this).addClass('fa-eye-slash');

            $('#ConfirmPassword').attr('type', 'password');
        }
    });


    const fileInputs = document.querySelectorAll('.custom-file-input');
    fileInputs.forEach(input => {
        input.addEventListener('change', function () {
            updateFileLabel(input);
        });
    });

    function updateFileLabel(input) {
        const label = document.querySelector(`label[for="${input.id}"]`);
        const files = Array.from(input.files);
        const fileNames = files.map(file => file.name).join(', ');
        label.textContent = fileNames || 'Choose Documents';
    }

    _$form.validate({
        rules: {
            Password: "required",
            ConfirmPassword: {
                equalTo: "#Password"
            },
            Pincode: {
                indianPincode: true
            },
            AdhaarNumber: {
                AadhaarNumber: true
            },
            Gender: "required",
            DOB: {
                pastDate: true
            }
        },
        messages: {
            pincode: {
                indianPincode: "Please enter a valid 6-digit PIN code."
            },
            AdhaarNumber: {
                AadhaarNumber: "Please enter a valid 12-digit Aadhaar number."
            },
            Gender: {
                require: "Please select an option."
            },
            DOB: {
                pastDate: "Date must be in the past."
            }
        }
    });

    _$form.find('.save-button').on('click', (e) => {
        e.preventDefault();

        if (!_$form.valid()) {
            return;
        }
        let roleNames = [];
        let _$roleCheckboxes = _$form[0].querySelectorAll("input[name='role']:checked");
        if (_$roleCheckboxes.length == 0) {
            abp.notify.error('Select at least one User Role.');
            return;
        }
        // Create a new FormData object
        var formData = new FormData(_$form[0]); // This includes all form fields

        // Append the file inputs to FormData
        formData.append("ImageFile", $("#ImageFile")[0].files[0]);
        formData.append("AdhaarDocFile", $("#AdhaarDocFile")[0].files[0]);
        formData.append("PANDocFile", $("#PANDocFile")[0].files[0]);
        formData.append("IsActive", $('#CreateUserIsActive').is(':checked'));
        debugger;
        $.each($("#AcademicDocsFile")[0].files, function () {
            formData.append("AcademicDocsFile", this);
        });

        formData.append("Image", $("#hdnImageFile").val());
        formData.append("AdhaarDoc", $("#hdnAdhaarFile").val());
        formData.append("PANDoc", $("#hdnPANFile").val());
        formData.append("AcademicDocs", $("#hdnAcademicFile").val());

        if (_$roleCheckboxes) {
            for (let roleIndex = 0; roleIndex < _$roleCheckboxes.length; roleIndex++) {
                let _$roleCheckbox = $(_$roleCheckboxes[roleIndex]);
                formData.append("roleNames", _$roleCheckbox.val());
            }
        }
        abp.ui.setBusy(_$form);

        let userId = $('#Id').val();
        let url = userId == 0 ? "/api/services/app/User/Create" : "/api/services/app/User/Update";
        let type = userId == 0 ? "POST" : "PUT";

        $.ajax({
            type: "POST",
            url: url,
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                if (response.success) {
                    if (userId == 0)
                        _$form[0].reset();
                    abp.notify.info(l('SavedSuccessfully'));
                    window.location.href = '/Users';
                }
            },
            error: function (xhr, status, error) {
                console.error("Error: ", status, error);
                abp.notify.error('Error In Saving');
            },
            complete: function () {
                abp.ui.clearBusy(_$form);
            }
        });
    });

    $('#saveDepartment').on('click', (e) => {
        let departmentName = $("#DepartmentName").val();

        $.ajax({
            type: "POST",
            url: "/Common/AddDepartment?name=" + departmentName,
            dataType: "json",
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                if (data.result.msg == "OK") {
                    let optionHTML = `
                                            <option value="${data.result.id}">
                                                            ${departmentName}
                                            </option>`;
                    $('#DepartmentId').append(optionHTML);
                    abp.notify.info(l('SavedSuccessfully'));
                    _$modal.modal('hide');
                }
            },
            error: function () {

            }
        });
    });

})(jQuery);