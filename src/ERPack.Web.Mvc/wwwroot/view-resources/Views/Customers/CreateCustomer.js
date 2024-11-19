(function ($) {
    let l = abp.localization.getSource('ERPack'),
        _$form = $('#customerCreateForm');
        
    var customerId = $("#CustomerId").val();
    if (customerId != null && CustomerId != "") {
        var ismaterial = $("#chkAddPrice").val()
        if (ismaterial == 'true') {
            addPrice();
        }
        
    }

    _$form.find('.save-button').on('click', (e) => {

        if (!validatePAN()) {
            return false;
        }
            
        if (!validateGST()) {
            return false;
        }

        _$form.validate({
            rules: {
                CategoryId: "required"
            },
            messages: {
                CategoryId: "Please select a category before saving."
            }
        });
           
        e.preventDefault();

        if (!_$form.valid()) {
            return;
        }
        let isValid = true;
        if ($("#chkAddPrice").is(":checked")) {
            $('[id*=customerMaterialPriceRow]').each(function () {
                $(this).find('input,select').each(function () {
                    if ($(this).val() === "") {
                        isValid = false;
                    }
                });
            });
        } else {
            $('[id*=customerMaterialPriceRow]').each(function () {
                $(this).find('input,select').each(function () {
                    $(this).attr('name', '');
                });
            });
        }
        if (!isValid) {
            abp.notify.error("Fill details of add price for the customer.");
            return;
        }

        let $frm = $('form');
        let customer = new FormData($frm[0]);
        
        $.ajax({
            type: "POST",
            url: "/Customers/CreateCustomer",
            data: customer,
            contentType: false,
            processData: false,
            success: function (response) {
                if (response.success == true) {
                    if (response.result["id"] == 0) {
                        abp.notify.error(l(response.result["msg"]));
                    } else {
                        abp.notify.info(l('SavedSuccessfully'));
                        $('form')[0].reset();
                        if (response.result.returnUrl == "" || response.result.returnUrl == null) {
                            window.location = '/Customers/Index';
                        }
                        else {
                            window.location.href = response.result.returnUrl + '?enquiryId=0&customerId=' + response.result.id;
                        }
                    }
                }
            },
            error: function () {

            }
        });
    });

    let cloneCount = $('[id*=customerMaterialPriceRow]:last').index() + 1;

    $("#addrow").on("click", function () {
        
        $('#customerMaterialPriceRow')
            .clone(true)
            .attr('id', 'customerMaterialPriceRow' + cloneCount, 'class', 'row')
            .insertAfter('[id^=customerMaterialPriceRow]:last')
            .find('input,select').val("");

        $('#customerMaterialPriceRow' + cloneCount).find('input,select').each(function () {
            $(this).attr('name', 'CustomerMaterials[' + cloneCount + '].' + $(this).attr('id'));
        });
        $('#customerMaterialPriceRow' + cloneCount).find('.fa-trash').removeAttr('hidden');
        cloneCount++;
    });

    $("#tblCustomerPrice").on("click", ".fa-trash", function (event) {
        $(this).closest("tr").remove();
        $('[id*=customerMaterialPriceRow]').each(function (i) {
            $(this).find('select[id="MaterialId"]').attr('name', 'CustomerMaterials[' + i + '].MaterialId');
            $(this).find('select[id="UnitId"]').attr('name', 'CustomerMaterials[' + i + '].UnitId');
            $(this).find('input[id="Price"]').attr('name', 'CustomerMaterials[' + i + '].Price');
        });
       // cloneCount -= 1
    });

})(jQuery);

function addPrice() {
    if ($("#chkAddPrice").prop("checked")) {
        $("#divAddPrice").show();

        $("#customerMaterialPriceRow").find('select[id="MaterialId"]').attr('name', 'CustomerMaterials[0].MaterialId');
        $("#customerMaterialPriceRow").find('select[id="UnitId"]').attr('name', 'CustomerMaterials[0].UnitId');
        $("#customerMaterialPriceRow").find('input[id="Price"]').attr('name', 'CustomerMaterials[0].Price');
    }
    else {
        $("#divAddPrice").hide();
    }
}

// PAN validation function
function isValidPAN(pan) {
    const panPattern = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
    return panPattern.test(pan);
}

function isValidGST(gst) {
    // Regular expression for validating GST number
    const gstRegex = /^[0-9]{2}[A-Z]{4}[0-9]{4}[A-Z][0-9][Z][0-9]$/;
    return gstRegex.test(gst);
}

$("#Name").blur(function () {

    let customerName = this.value;
    let idType = "CustomerId"

    if (customerName && customerName.length > 2 && $("#Id").val() == '0') {
        $.ajax({
            url: `/Common/GetIdByPreference?idType=${idType}&name=${customerName}`,
            method: "GET",
            dataType: "json",
            success: function (data) {
                $("#CustomerId").val(data.result.id);
            },
            error: function (xhr, status, error) {
                // Handle errors
                console.error("Error:", status, error);
            }
        });
    }
});

function validatePAN() {
    const panInput = document.getElementById('PAN').value;
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    const messageDiv = document.getElementById('panError');

    if (panInput != "") {
        if (panRegex.test(panInput)) {
            messageDiv.textContent = '';
            return true;
        } else {
            messageDiv.textContent = 'Invalid PAN format. Please enter a valid PAN.';
            messageDiv.style.color = 'red';
            return false;
        }
    } else {
        messageDiv.textContent = '';
        return true;
    }

}

function validateGST() {
    const gstInput = document.getElementById('GSTNo').value;
    const gstRegex = /^(?:[0-9]{2})(?:[A-Z]{4})(?:\d{4})(?:[A-Z]{1})(?:Z)(?:[0-9A-Z]{1})$/;
    const messageDiv = document.getElementById('gstError');

    if (gstInput != "") {
        if (gstRegex.test(gstInput)) {
            messageDiv.textContent = '';
            return true;
        } else {
            messageDiv.textContent = 'Invalid GST Number format. Please enter a valid GST.';
            messageDiv.style.color = 'red';
            return false;
        }
    } else {
        messageDiv.textContent = '';
        return true;
    }

}