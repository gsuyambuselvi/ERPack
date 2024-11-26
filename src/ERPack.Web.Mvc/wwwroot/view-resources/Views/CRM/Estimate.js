(function ($) {
  function getParameterByName(name) {
    const url = window.location.href;
    const nameRegex = name.replace(/[\[\]]/g, "\\$&");
    const regex = new RegExp("[?&]" + nameRegex + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
    return results ? decodeURIComponent(results[2].replace(/\+/g, " ")) : null;
  }
  $(document).ready(function () {
    var designId = getParameterByName("designId");
    if (designId > 0) {
      generateEstimateId($("#DesignId").val());
      GetDesignDetails(designId);
    } else {
      GetDesignDetails($("#designId").val());
    }
  });
  $(document).on("click", "#addRow", function () {
    CloneRow();
  });
  $("#asKit").on("change", function () {
    $("#includeMaterial").prop(
      "checked",
      $("#editIsIncludeMaterial").val() == "True" ? true : false
    );
    if ($(this).prop("checked")) {
      $("#includeMaterial").attr("disabled", false);
    } else {
      $("#includeMaterial").attr("disabled", true);
    }
  });
  function generateEstimateId(name) {
    let idType = "EstimateId";
    $.ajax({
      url: `/Common/GetIdByPreference?idType=${idType}&name=${name}`,
      method: "GET",
      dataType: "json",
      success: function (data) {
        $("#" + idType).val(data.result.id);
      },
      error: function (xhr, status, error) {
        // Handle errors
        console.error("Error:", status, error);
      },
    });
  }

  $("#tblTask").on("click", ".fa-trash", function (event) {
    $(this).closest("tr").remove();
    CalculateTotalAmount();
  });
})(jQuery);

function fnFillMaterialInfo(obj) {
  let selectedId = obj.id;
  let lastCharOfId = selectedId.charAt(selectedId.length - 1);
  let customerId = $("#inpCustomerIdSpan").text();
  let materialId = obj.value;

  $.ajax({
    type: "GET",
    url: `/Materials/GetMaterialByCustomerId?materialId=${materialId}&customerId=${customerId}`,
    dataType: "json",
    contentType: "application/json; charset=utf-8",
    success: function (response) {
      if (response.result.msg == "OK") {
        let data = JSON.parse(response.result.data);
        $("#materialId" + lastCharOfId).val(data.Id);
        $("#hdnMaterialId" + lastCharOfId).val(data.Id);
        $("#unitId" + lastCharOfId).val(data.SellingUnitId);
        $("#unitName" + lastCharOfId).val(data.SellingUnitId);
        $("#price" + lastCharOfId).val(data.SellingPrice);
        $("#cGST" + lastCharOfId).val(data.CGST);
        $("#sGST" + lastCharOfId).val(data.SGST);
        $("#iGST" + lastCharOfId).val(data.IGST);
      }
    },
    error: function () {
      alert("Error occured!!");
    },
  });
}
const modal = $("#myModal");
const modalContent = $(".modal-content");

$("#zoomSlider").on("input", function () {
  modalContent.css("transform", `scale(${this.value})`);
});
$(".close").on("click", function (event) {
  event.stopPropagation();
  modal.hide();
  $("#zoomSlider").val(1);
  modalContent.css("transform", "scale(1)");
});
$("#magnify").on("click", function () {
  app.ZoomoutImage("filePreview", "filePreview");
});
function GetDesignDetails(id) {
  $.ajax({
    type: "GET",
    url: "/Production/GetDesignById?id=" + id,
    dataType: "json",
    contentType: "application/json; charset=utf-8",
    success: function (response) {
      if (response.result.msg == "OK") {
        let data = JSON.parse(response.result.data);
        $("#enquiryId").val(data.EnquiryId);
        $("#DesignId").val(data.DesignId);
        $("#DesignId").attr("desId", data.Id);
        if (data.ReportDoc != null) {
          var getId = data.ReportDoc.includes(".pdf")
            ? "#pdfPreview"
            : "#designImage";
          $(getId).show();
          $(getId).attr("src", data.ReportDoc);
          $("#magnify").attr("disabled", false);
          $("#downloadLink").removeClass("disabled-link");
          $(".icon-buttons a")
            .attr("href", data.ReportDoc)
            .attr("download", data.ReportDoc);
        }
        GetCustomerDetails(data.CustomerId);
        if ($("#id").val() == 0 || $("#id").val() == undefined) {
          GetDesignMaterialDetails(id);
        } else {
          let estimateId = $("#id").val();
          GetEstimateTasks(estimateId);
          if ($("#editIsKit").val() == "True") {
            $("#asKit").prop("checked", true);
            $("#asKit").trigger("change");
          }
        }
      }
    },
    error: function () {
      alert("Error occured!!");
    },
  });
}

function GetDesignMaterialDetails(id) {
  $.ajax({
    type: "GET",
    url: "/Production/GetDesignMaterials?id=" + id,
    dataType: "json",
    contentType: "application/json; charset=utf-8",
    success: function (response) {
      if (response.result.msg == "OK") {
        let data = JSON.parse(response.result.data);
        $.each(data, function (index, value) {
          $("#materialId" + index).val(value.ItemCode);
          $("#hdnMaterialId" + index).val(value.MaterialId);
          $("#unitId" + index).val(value.SellingUnitId);
          $("#unitName" + index).val(value.SellingUnitId);
          $("#price" + index).val(value.SellingPrice);
          $("#hsnCode" + index).val(value.Material.HSN);
          $("#cGST" + index).val(value.CGST);
          $("#sGST" + index).val(value.SGST);
          $("#iGST" + index).val(value.IGST);
          $("#materialName" + index).val(value.MaterialId);
          $("#quantity" + index).val(value.Quantity);
          $("#discount" + index).val(0);
          $("#amount" + index).val(value.SellingPrice * value.Quantity);

          var isLastElement = index == data.length - 1;
          if (!isLastElement) {
            CloneRow();
          }
        });
        CalculateTotalAmount();
      }
    },
    error: function (ex) {
      alert("Error occured!!");
    },
  });
}

function GetEstimateTasks(id) {
  $.ajax({
    type: "GET",
    url: "/CRM/GetEstimateTasks?estimateId=" + id,
    dataType: "json",
    contentType: "application/json; charset=utf-8",
    success: function (response) {
      if (response.result.msg == "OK") {
        let data = response.result.data;
        $.each(data, function (index, value) {
          $("#hdnEstimateTaskId" + index).val(value.id);
          $("#materialId" + index).val(value.itemCode);
          $("#hdnMaterialId" + index).val(value.materialId);
          $("#unitId" + index).val(value.unitId);
          $("#unitName" + index).val(value.unitId);
          $("#quantity" + index).val(value.qty);
          $("#price" + index).val(value.price);
          $("#cGST" + index).val(value.cgst);
          $("#sGST" + index).val(value.sgst);
          $("#iGST" + index).val(value.igst);
          $("#materialName" + index).val(value.materialId);
          $("#discount" + index).val(value.discountPercentage);
          $("#amount" + index).val(value.amount);

          var isLastElement = index == data.length - 1;
          if (!isLastElement) {
            CloneRow();
          }
        });
        CalculateTotalAmount();
      }
    },
    error: function () {
      alert("Error occured!!");
    },
  });
}

function GetCustomerDetails(id) {
  $.ajax({
    type: "GET",
    url: "/Customers/GetCustomerById?id=" + id,
    dataType: "json",
    contentType: "application/json; charset=utf-8",
    success: function (response) {
      if (response.result.msg == "OK") {
        let data = JSON.parse(response.result.data);
        $("#inpCustomerId").val(data.Id);
        $("#customerId").val(data.CustomerId);
        $("#taCustomers").val(data.Name);
        $("#customerName").val(data.Name);
        $("#customerAddress").val(
          data.Address1 +
            "," +
            data.Address2 +
            "," +
            data.City +
            "," +
            data.State +
            "," +
            data.PinCode +
            "," +
            data.Country
        );
        $("#customerPan").val(data.PAN);
        $("#customerGst").val(data.GSTNo);
        $("#customerEmail").val(data.EmailAddress);
        $("#customerPhone").val(data.Mobile);
        $("#customerWebsite").val(data.Website);

        $("#inpCustomerIdSpan").text(data.Id);
        $("#customerIdSpan").text(data.CustomerId);
        $("#taCustomersSpan").text(data.Name);
        $("#customerNameSpan").text(data.Name);
        $("#customerAddressSpan").html(
          data.Address1 +
            "<br>" +
            data.Address2 +
            "<br>" +
            data.City +
            "," +
            data.State +
            "," +
            data.PinCode +
            "<br>" +
            data.Country
        );
        $("#customerPanSpan").text(data.PAN);
        $("#customerGstSpan").text(data.GSTNo);
        $("#customerEmailSpan").text(data.EmailAddress);
        $("#customerPhoneSpan").text(data.Mobile);
        $("#customerWebsiteSapn").text(data.Website);
      }
    },
    error: function (res) {
      alert("Error occured!!");
    },
  });
}

let cloneCount = 1;

function CloneRow() {
  $("#taskRow")
    .clone(true)
    .attr("id", "taskRow" + cloneCount, "class", "row")
    .insertAfter("[id^=taskRow]:last")
    .find("input,select")
    .val("");

  $("#taskRow" + cloneCount)
    .find("input,select")
    .each(function () {
      $(this).attr("id", $(this).attr("id").replace(/.$/, cloneCount));
      $(this).attr("name", $(this).attr("name") + cloneCount);
    });
  $("#taskRow" + cloneCount)
    .find(".fa-trash")
    .removeAttr("hidden");
  cloneCount++;
}

function CalculateTotalAmount() {
  var rowCount = $("#tblTask tbody tr").length;
  var totalAmount = 0;
  var netAmount = 0;
  var iCGSTPercentage = 0;
  var iSGSTPercentage = 0;
  var iIGSTPercentage = 0;
  var iCGSTAmount = 0;
  var iSGSTAmount = 0;
  var iIGSTAmount = 0;
  var iDiscountPercentage = 0;

  for (i = 0; i < rowCount; i++) {
    var ele = document.getElementById("amount" + i);
    if (ele != undefined) {
      var iPrice = parseInt($("#price" + i).val() || 0);
      var iQty = parseInt($("#quantity" + i).val() || 0);
      if ($("#discount" + i).val() == "") {
        $("#discount" + i).val(0);
      }
      iDiscountPercentage = parseInt($("#discount" + i).val() || 0);

      if (parseInt($("#cGST" + i).val()) > iCGSTPercentage)
        iCGSTPercentage = parseInt($("#cGST" + i).val() || 0);
      if (parseInt($("#sGST" + i).val()) > iSGSTPercentage)
        iSGSTPercentage = parseInt($("#sGST" + i).val() || 0);
      if (parseInt($("#iGST" + i).val()) > iIGSTPercentage)
        iIGSTPercentage = parseInt($("#iGST" + i).val() || 0);

      var iAmount = iPrice * iQty;
      var iDiscountAmount = (iAmount * iDiscountPercentage) / 100;
      var iAmountAfterDiscount = iAmount - iDiscountAmount;

      $("#amount" + i).val(iAmountAfterDiscount);
      totalAmount += iAmountAfterDiscount;
    }

    if (iCGSTPercentage > 0)
      iCGSTAmount = (totalAmount * iCGSTPercentage) / 100;
    if (iSGSTPercentage > 0)
      iSGSTAmount = (totalAmount * iSGSTPercentage) / 100;
    if (iIGSTPercentage > 0)
      iIGSTAmount = (totalAmount * iIGSTPercentage) / 100;
    netAmount = totalAmount + (iCGSTAmount + iSGSTAmount + iIGSTAmount);

    $("#divGrossAmount").text(totalAmount);
    $("#divCGST").text(iCGSTAmount);
    $("#divSGST").text(iSGSTAmount);
    $("#divIGST").text(iIGSTAmount);
    $("#divTotalAmount").text(netAmount.toFixed(2));
  }
}

function SaveEstimate() {
  var formData = $("#estimateCreateForm").serializeArray();
  var tasks = $("input[id^='materialId']");
  for (i = 0; i < tasks.length; i++) {
    if ($("#id").val() != 0) {
      formData.push({
        name: "EstimateTasks[" + i + "].Id",
        value: $($("input[id^='hdnEstimateTaskId']")[i]).val(),
      });
    }
    formData.push({
      name: "EstimateTasks[" + i + "].MaterialId",
      value: $($("input[id^='hdnMaterialId']")[i]).val(),
    });
    formData.push({
      name: "EstimateTasks[" + i + "].UnitId",
      value: $($("input[id^='unitId']")[i]).val(),
    });
    formData.push({
      name: "EstimateTasks[" + i + "].Qty",
      value: $($("input[id^='quantity']")[i]).val() || 0,
    });
    formData.push({
      name: "EstimateTasks[" + i + "].Price",
      value: $($("input[id^='price']")[i]).val(),
    });
    formData.push({
      name: "EstimateTasks[" + i + "].HsnCode",
      value: $($("input[id^='hsnCode']")[i]).val(),
    });
    formData.push({
      name: "EstimateTasks[" + i + "].DiscountPercentage",
      value: $($("input[id^='discount']")[i]).val(),
    });
    formData.push({
      name: "EstimateTasks[" + i + "].CGST",
      value: $($("input[id^='cGST']")[i]).val(),
    });
    formData.push({
      name: "EstimateTasks[" + i + "].SGST",
      value: $($("input[id^='sGST']")[i]).val(),
    });
    formData.push({
      name: "EstimateTasks[" + i + "].IGST",
      value: $($("input[id^='iGST']")[i]).val(),
    });
    formData.push({
      name: "EstimateTasks[" + i + "].Amount",
      value: $($("input[id^='amount']")[i]).val(),
    });
  }
  formData.push({ name: "TotalAmount", value: $("#divTotalAmount").text() });
  formData.push({ name: "DesignId", value: $("#DesignId").attr("desId") });
  formData.push({ name: "CGSTAmount", value: $("#divCGST").text() });
  formData.push({ name: "SGSTAmount", value: $("#divSGST").text() });
  formData.push({ name: "IGSTAmount", value: $("#divIGST").text() });
  formData.push({ name: "IsKit", value: $("#asKit").prop("checked") });
  formData.push({
    name: "IsIncludeMaterial",
    value: $("#includeMaterial").prop("checked"),
  });
  formData.push({
    name: "IsIncludeImage",
    value: $("#includeImage").prop("checked"),
  });

  $.ajax({
    type: "POST",
    data: formData,
    url: "/CRM/SaveEstimate",
    success: function (data) {
      if (data.result.msg == "OK") {
        $("#id").val(data.result.id);
        abp.notify.success("SavedSuccessfully");
        $("#estimateCreateForm")[0].reset();
      } else {
        abp.notify.error("Error In Saving");
      }
    },
    failure: function (response) {},
    error: function (response) {
      alert("error");
    },
  });
}

function ShowPreview() {
  $("#divPrevEstimateId").text("Estimate Id : " + $("#EstimateId").val());
  $("#divPrevSubject").text("Sub : " + $("#description").val());

  $("#divPrevName").text($("#taCustomers").val());
  $("#divPrevAddress").text($("#customerAddress").val());
  $("#divPrevPhone").text("Phone :" + $("#customerPhone").val());
  $("#divPrevEmail").text("Email :" + $("#customerEmail").val());

  $("#divPrevGrossAmount").text($("#divGrossAmount").text());
  $("#divPrevCGST").text($("#divCGST").text());
  $("#divPrevSGST").text($("#divSGST").text());
  $("#divPrevIGST").text($("#divIGST").text());
  $("#divPrevTotalAmount").text($("#divTotalAmount").text());

  var tableRow = "";
  var icount = 1;
  var tasks = $("input[id^='materialId']");
  for (i = 0; i < tasks.length; i++) {
    var MatName = $($("select[id^='materialName'] :selected")[i]).text();
    var MatUnit = $($("select[id^='unitName'] :selected")[i]).text();
    var MatQty = $($("input[id^='quantity']")[i]).val();
    var MatPrice = $($("input[id^='price']")[i]).val();
    var MatDiscount = $($("input[id^='discount']")[i]).val();
    var MatAmount = $($("input[id^='amount']")[i]).val();

    tableRow +=
      '<tr><th scope="row">' +
      icount +
      "</th><td>" +
      MatName +
      "</td><td>" +
      MatUnit +
      "</td><td>" +
      MatQty +
      "</td><td>" +
      MatPrice +
      "</td><td>" +
      MatDiscount +
      "</td><td>" +
      MatAmount +
      "</td></tr>";
    icount++;
  }
  $("#tblPrevBody").html(tableRow);
  $("#EstimatePreviewModal").modal("show");
}

function GeneratePdf() {
  if ($("#id").val() == 0) {
    abp.notify.info("Please save estimate first to generate pdf !");
    return;
  }

  var estimateId = $("#id").val();
  if (estimateId != null) {
    var url = "/CRM/PdfEstimate?estimateId=" + estimateId;
    window.open(url, "_blank");
  } else {
    abp.notify.info("Please enter a valid EstimateId.!");
  }
}

function SendApprovalEmail() {
  let estimate = $("#EstimateId").val();
  let customerId = $("#inpCustomerId").val();
  let enquiryId = $("#designId").val();

  $.ajax({
    type: "GET",
    url:
      "/CRM/EstimateApprovalEmail?customerId=" +
      customerId +
      "&enquiryId=" +
      enquiryId +
      "&estimate='" +
      estimate +
      "'",
    dataType: "json",
    contentType: "application/json; charset=utf-8",
    success: function (response) {
      if (response.result.msg == "OK") {
        abp.notify.info("Estimate Sent for Approval !");
      }
    },
    error: function () {
      alert("Error occured!!");
    },
  });
}
