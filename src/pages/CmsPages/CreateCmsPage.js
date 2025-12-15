import React, { useEffect, useState } from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  Button,
  Input,
  Label,
  FormGroup,
  Card,
  CardBody,
  CardHeader,
  Row,
  Col,
} from "reactstrap";
import toast from "react-hot-toast";
import axiosInstance from "pages/Utility/axiosInstance";
import Breadcrumb from "components/Common/Breadcrumb2";
import { useNavigate, useParams } from "react-router-dom";
import ConfirmationModal from "components/Modals/ConfirmationModal";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { showError } from "helpers/notification_helper";
import Cookies from "js-cookie";

const isQuillEmpty = (value) => {
  if (!value) return true;
  const stripped = value.replace(/<(.|\n)*?>/g, "").trim();
  return stripped.length === 0;
};
// Validation Schema
const validationSchema = Yup.object().shape({
  ceo_message_en: Yup.string().test(
    "required",
    "CEO Message (EN) is required",
    (value) => !isQuillEmpty(value) // returns true if not empty
  ),
  ceo_message_ar: Yup.string().test(
    "required",
    "CEO Message (AR) is required",
    (value) => !isQuillEmpty(value)
  ),
  vision_en: Yup.string().test(
    "required",
    "Vision (EN) is required",
    (value) => !isQuillEmpty(value)
  ),
  vision_ar: Yup.string().test(
    "required",
    "Vision (AR) is required",
    (value) => !isQuillEmpty(value)
  ),
  mission_en: Yup.string().test(
    "required",
    "Mission (EN) is required",
    (value) => !isQuillEmpty(value)
  ),
  mission_ar: Yup.string().test(
    "required",
    "Mission (AR) is required",
    (value) => !isQuillEmpty(value)
  ),
  goals_en: Yup.string().test(
    "required",
    "Goals (EN) is required",
    (value) => !isQuillEmpty(value)
  ),
  goals_ar: Yup.string().test(
    "required",
    "Goals (AR) is required",
    (value) => !isQuillEmpty(value)
  ),
  values_en: Yup.string().test(
    "required",
    "Values (EN) is required",
    (value) => !isQuillEmpty(value)
  ),
  values_ar: Yup.string().test(
    "required",
    "Values (AR) is required",
    (value) => !isQuillEmpty(value)
  ),
  arabic_1: Yup.string().test(
    "required",
    "Arabic-1 is required",
    (value) => !isQuillEmpty(value)
  ),
  arabic_2: Yup.string().test(
    "required",
    "Arabic-2 is required",
    (value) => !isQuillEmpty(value)
  ),


  decrees_laws_decisions: Yup.array().of(
    Yup.object().shape({
      title_en: Yup.string().required("Title (EN) is required"),
      title_ar: Yup.string().required("Title (AR) is required"),
      pdf_en: Yup.mixed()
        .test("required", "PDF (EN) is required", function (value) {
          const parent = this.parent;
          return value || parent?.pdf_en || parent?.file_en;
        })
        .test("fileFormat", "Only PDF files are allowed", function (value) {
          if (!value || typeof value === "string") return true;
          return value?.type === "application/pdf";
        }),
      pdf_ar: Yup.mixed()
        .test("required", "PDF (AR) is required", function (value) {
          const parent = this.parent;
          return value || parent?.pdf_ar || parent?.file_ar;
        })
        .test("fileFormat", "Only PDF files are allowed", function (value) {
          if (!value || typeof value === "string") return true;
          return value?.type === "application/pdf";
        }),
      order: Yup.number()
        .typeError("Order must be a number")
        .required("Order is required"),
    })
  ),
});

// Helper: Convert file to base64
const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const CreateCmsPage = () => {
  const [pdfFiles, setPdfFiles] = useState({});
  const [initialData, setInitialData] = useState(null);
  const [baseUrl, setBaseUrl] = useState();
  const [openModal, setOpenModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const permissions = JSON.parse(localStorage?.getItem("permissions")) || [];
  const hasEditPermission = permissions.includes("pages.update");
  const hasCreatePermission = permissions.includes("pages.create");
  const isAdmin = Cookies.get('isAdmin') == "yes"
  const { id } = useParams();
  const navigate = useNavigate();

  // Suppress Quill's deprecated DOMNodeInserted usage
  if (typeof window !== 'undefined') {
    const originalAddEventListener = Element.prototype.addEventListener;
    Element.prototype.addEventListener = function (type, listener, options) {
      if (type === 'DOMNodeInserted') return; // ignore this event
      return originalAddEventListener.call(this, type, listener, options);
    };
  }

  useEffect(() => {
    if (!hasEditPermission && !hasCreatePermission && !isAdmin) {
      navigate("/pages-403");
    }
  }, []);

  // Upload PDF with a custom name based on the English title
  const uploadPdfAndGetUrl = async (file, customFileName) => {
    try {
      const base64Data = await fileToBase64(file);
      const payload = {
        media: base64Data,
        file_name: customFileName, // send filename to backend
      };

      const response = await axiosInstance.post(
        "V1/pages/upload-media-pdf",
        payload
      );

      if (response.data?.data?.file) {
        toast.success(`${customFileName} uploaded successfully`);
        return response.data.data.file;
      } else {
        toast.error("Failed to get PDF URL from server");
        return null;
      }
    } catch (error) {
      console.error("Error uploading PDF:", error);
      toast.error("Error uploading PDF file");
      return null;
    }
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }], // Headings (paragraph / H1–H6)
      [{ size: ["small", false, "large", "huge"] }], // Font size
      ["bold", "italic", "underline"], // Inline styles
      [{ align: [] }], // Alignment (includes RTL)
      [{ direction: "rtl" }], // Explicit RTL/LTR control
      [{ list: "ordered" }, { list: "bullet" }], // Lists
      ["link", "image"], // Media
      ["clean"], // Clear formatting
    ],
  };

  // Define allowed formats
  const formats = [
    "header",
    "size",
    "bold",
    "italic",
    "underline",
    "color",
    "background",
    "script",
    "align",
    "direction",
    "list",
    "link",
    "image"
  ];

  //  Handle File Change with Title-based File Name
  const handleFileChange = async (
    event,
    index,
    fieldName,
    setFieldValue,
    values
  ) => {
    const file = event.target.files[0];
    if (!file) return;

    const englishTitle = values.decrees_laws_decisions[index]?.title_en?.trim();
    if (!englishTitle) {
      toast.error("Please enter the English title before uploading the PDF.");
      event.target.value = ""; // Reset the input
      return;
    }

    // 🧹 Sanitize filename
    const safeTitle = englishTitle.replace(/[^a-z0-9]/gi, "_").toLowerCase();
    const customFileName = `${safeTitle}_${fieldName}`;

    toast.loading("Uploading PDF...");
    const pdfUrl = await uploadPdfAndGetUrl(file, customFileName);
    toast.dismiss();

    if (pdfUrl) {
      setPdfFiles((prev) => ({
        ...prev,
        [`${fieldName}_${index}`]: pdfUrl,
      }));
      setFieldValue(`decrees_laws_decisions[${index}].${fieldName}`, pdfUrl);
    }
  };

  // Fetch Data
  const fetchHierarchyData = async () => {
    try {
      const response = await axiosInstance.get(`V1/pages/view/${id}`);
      setInitialData(response.data?.data?.page?.data);
      setBaseUrl(response.data?.data?.base_url);
    } catch (error) {
      toast.error("Failed to load data");
    }
  };

  useEffect(() => {
    fetchHierarchyData();
  }, []);

  if (!initialData) {
    return <div className="p-5 text-center">Loading...</div>;
  }

  const initialValues = {
    ceo_message_en: initialData.ceo_message_en || "",
    ceo_message_ar: initialData.ceo_message_ar || "",
    vision_en: initialData.vision_en || "",
    vision_ar: initialData.vision_ar || "",
    mission_en: initialData.mission_en || "",
    mission_ar: initialData.mission_ar || "",
    goals_en: initialData.goals_en || "",
    goals_ar: initialData.goals_ar || "",
    values_en: initialData.values_en || "",
    values_ar: initialData.values_ar || "",
    arabic_1: initialData.arabic_1 || "",
    arabic_2: initialData.arabic_2 || "",
    decrees_laws_decisions:
      initialData.decrees_laws_decisions?.length > 0
        ? initialData.decrees_laws_decisions
        : [{ title_en: "", title_ar: "", pdf_en: "", pdf_ar: "", order: "" }],
  };

  const RichTextField = ({ field, form }) => {
    const handleChange = (value) => {
      form.setFieldValue(field.name, value);
    };
    return (
      <ReactQuill
        value={field.value || ""}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        theme="snow"
        style={{ height: "180px", marginBottom: "60px" }}
      />
    );
  };

  const handleUpdatePage = async (formValues) => {
    try {
      const payload = { page_key: "hierarchy", data: formValues };
      const response = await axiosInstance.post("/V1/pages/update", payload);
      if (response.status === 200) {
        toast.success("Hierarchy updated successfully!");
      } else {
        toast.error("Failed to update page. Please try again.");
      }
    } catch (error) {
      console.error("Error updating hierarchy page:", error);
      toast.error("An error occurred while updating the page.");
    }
  };


  return (
    <div className="page-content my-3">
      <div className="d-flex justify-content-between mb-2 align-items-center mx-3">
        <Breadcrumb
          title="Hierarchy"
          breadcrumbItems={[
            { title: "Dashboard", link: "/dashboard" },
            { title: "Hierarchy", link: "#" },
          ]}
        />
        <Button onClick={() => navigate("/cms-pages")}>Back</Button>
      </div>

      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          const updatedValues = { ...values };
          updatedValues.decrees_laws_decisions.forEach((item, index) => {
            updatedValues.decrees_laws_decisions[index].pdf_en =
              pdfFiles[`pdf_en_${index}`] || item.pdf_en || null;
            updatedValues.decrees_laws_decisions[index].pdf_ar =
              pdfFiles[`pdf_ar_${index}`] || item.pdf_ar || null;
          });

          await handleUpdatePage(updatedValues);
          setSubmitting(false);
          navigate("/cms-pages");
        }}
      >
        {({ values, isSubmitting, setFieldValue, handleSubmit, validateForm }) => (
          <Form onSubmit={async (e) => {
            e.preventDefault();
            const errors = await validateForm();
            if (Object.keys(errors).length > 0) {
              showError("Validation error!");
            }
            handleSubmit(e); // now it will run onSubmit
          }}>
            {/* Page Details */}
            <Card className="mb-4 shadow-sm">
              <CardHeader className="bg-light fw-bold">Hierarchy Details</CardHeader>
              <CardBody>
                <Row className="g-3 g-md-5 g-xl-3">
                  {[
                    ["CEO Message (EN)", "ceo_message_en"],
                    ["CEO Message (AR)", "ceo_message_ar"],
                    ["Vision (EN)", "vision_en"],
                    ["Vision (AR)", "vision_ar"],
                    ["Mission (EN)", "mission_en"],
                    ["Mission (AR)", "mission_ar"],
                    ["Goals (EN)", "goals_en"],
                    ["Goals (AR)", "goals_ar"],
                    ["Values (EN)", "values_en"],
                    ["Values (AR)", "values_ar"],
                  ].map(([label, name], i) => (
                    <Col md="6" key={i}>
                      <FormGroup>
                        <Label>{label}</Label>
                        <span style={{ color: "red" }}>*</span>
                        <Field name={name} component={RichTextField} />
                        <ErrorMessage
                          name={name}
                          component="div"
                          className="text-danger small mt-1"
                        />
                      </FormGroup>
                    </Col>
                  ))}

                  <Col md="6"></Col>

                  <Col md="6">
                    <FormGroup>
                      <Label>Quality Policy</Label>
                      <span style={{ color: "red" }}>*</span>
                      <Field name="arabic_1" component={RichTextField} />
                      <ErrorMessage
                        name="arabic_1"
                        component="div"
                        className="text-danger small mt-1"
                      />
                    </FormGroup>
                  </Col>

                  <Col md="6"></Col>

                  <Col md="6">
                    <FormGroup>
                      <Label>The General Policy of the National Centre for Statistics and Information</Label>
                      <span style={{ color: "red" }}>*</span>
                      <Field name="arabic_2" component={RichTextField} />
                      <ErrorMessage
                        name="arabic_2"
                        component="div"
                        className="text-danger small mt-1"
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </CardBody>
            </Card>

            {/* Decrees / Laws / Decisions */}
            <FieldArray name="decrees_laws_decisions">
              {({ push }) => (
                <>
                  {values.decrees_laws_decisions.map((item, index) => (
                    <Card key={index} className="mb-4 shadow-sm">
                      <CardHeader className="bg-light d-flex justify-content-between align-items-center">
                        <strong>Decree / Law / Decision {index + 1}</strong>
                        {index > 0 && (
                          <Button
                            color="danger"
                            size="sm"
                            onClick={() => {
                              setDeleteIndex(index);
                              setOpenModal(true);
                            }}
                          >
                            Remove
                          </Button>
                        )}
                      </CardHeader>
                      <CardBody>
                        <Row>
                          {/* English Title */}
                          <Col md="6">
                            <FormGroup>
                              <Label>Title (EN)</Label>
                              <span style={{ color: "red" }}>*</span>
                              <Field
                                name={`decrees_laws_decisions[${index}].title_en`}
                                as={Input}
                                placeholder="Enter Title (EN)"
                              />
                              <ErrorMessage
                                name={`decrees_laws_decisions[${index}].title_en`}
                                component="div"
                                className="text-danger small mt-1"
                              />
                            </FormGroup>
                          </Col>

                          {/* Arabic Title */}
                          <Col md="6">
                            <FormGroup>
                              <Label>Title (AR)</Label>
                              <span style={{ color: "red" }}>*</span>
                              <Field
                                name={`decrees_laws_decisions[${index}].title_ar`}
                                as={Input}
                                placeholder="Enter Title (AR)"
                              />
                              <ErrorMessage
                                name={`decrees_laws_decisions[${index}].title_ar`}
                                component="div"
                                className="text-danger small mt-1"
                              />
                            </FormGroup>
                          </Col>

                          {/* PDF EN */}
                          <Col md="6">
                            <FormGroup>
                              <Label>PDF (EN)</Label>
                              <span style={{ color: "red" }}>*</span>
                              <Input
                                type="file"
                                accept="application/pdf"
                                onChange={(e) =>
                                  handleFileChange(
                                    e,
                                    index,
                                    "pdf_en",
                                    setFieldValue,
                                    values
                                  )
                                }
                              />
                              <ErrorMessage
                                name={`decrees_laws_decisions[${index}].pdf_en`}
                                component="div"
                                className="text-danger small mt-1"
                              />
                              {item.pdf_en && (
                                <a
                                  href={baseUrl + "/" + item.pdf_en}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="d-block mt-2 text-primary"
                                >
                                  📄 View existing PDF (EN)
                                </a>
                              )}
                            </FormGroup>
                          </Col>

                          {/* PDF AR */}
                          <Col md="6">
                            <FormGroup>
                              <Label>PDF (AR)</Label>
                              <span style={{ color: "red" }}>*</span>
                              <Input
                                type="file"
                                accept="application/pdf"
                                onChange={(e) =>
                                  handleFileChange(
                                    e,
                                    index,
                                    "pdf_ar",
                                    setFieldValue,
                                    values
                                  )
                                }
                              />
                              <ErrorMessage
                                name={`decrees_laws_decisions[${index}].pdf_ar`}
                                component="div"
                                className="text-danger small mt-1"
                              />
                              {item.pdf_ar && (
                                <a
                                  href={baseUrl + "/" + item.pdf_ar}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="d-block mt-2 text-primary"
                                >
                                  📄 View existing PDF (AR)
                                </a>
                              )}
                            </FormGroup>
                          </Col>

                          {/* Order */}
                          <Col md="6">
                            <FormGroup>
                              <Label>Order</Label>
                              <span style={{ color: "red" }}>*</span>
                              <Field
                                name={`decrees_laws_decisions[${index}].order`}
                                type="number"
                                as={Input}
                              />
                              <ErrorMessage
                                name={`decrees_laws_decisions[${index}].order`}
                                component="div"
                                className="text-danger small mt-1"
                              />
                            </FormGroup>
                          </Col>
                        </Row>
                      </CardBody>
                    </Card>
                  ))}

                  <Button
                    color="primary"
                    type="button"
                    onClick={() =>
                      push({
                        title_en: "",
                        title_ar: "",
                        pdf_en: "",
                        pdf_ar: "",
                        order: "",
                      })
                    }
                  >
                    + Add More
                  </Button>
                </>
              )}
            </FieldArray>

            {/* Delete Confirmation */}
            <ConfirmationModal
              okText="Confirm"
              isVisible={openModal}
              title="Delete Decree / Law / Decision"
              content="Are you sure you want to delete this item?"
              onCancel={() => {
                setDeleteIndex(null);
                setOpenModal(false);
              }}
              onOk={() => {
                if (deleteIndex !== null) {
                  setFieldValue(
                    "decrees_laws_decisions",
                    values.decrees_laws_decisions.filter(
                      (_, i) => i !== deleteIndex
                    )
                  );
                  setDeleteIndex(null);
                  setOpenModal(false);
                }
              }}
            />

            <div className="text-end mt-4">
              <Button color="success" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CreateCmsPage;
