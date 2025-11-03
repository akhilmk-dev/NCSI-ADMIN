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

// Validation Schema
const validationSchema = Yup.object().shape({
  ceo_message_en: Yup.string().required("CEO Message (EN) is required"),
  ceo_message_ar: Yup.string().required("CEO Message (AR) is required"),
  vision_en: Yup.string().required("Vision (EN) is required"),
  vision_ar: Yup.string().required("Vision (AR) is required"),
  mission_en: Yup.string().required("Mission (EN) is required"),
  mission_ar: Yup.string().required("Mission (AR) is required"),
  goals_en: Yup.string().required("Goals (EN) is required"),
  goals_ar: Yup.string().required("Goals (AR) is required"),
  values_en: Yup.string().required("Values (EN) is required"),
  values_ar: Yup.string().required("Values (AR) is required"),
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

  const { id } = useParams();
  const navigate = useNavigate();

  // Upload PDF
  const uploadPdfAndGetUrl = async (file) => {
    try {
      const base64Data = await fileToBase64(file);
      const payload = { media: base64Data };
      const response = await axiosInstance.post("V1/pages/upload-media-pdf", payload);

      if (response.data?.data?.file) {
        toast.success("PDF uploaded successfully");
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

  const handleFileChange = async (event, index, fieldName, setFieldValue) => {
    const file = event.target.files[0];
    if (file) {
      toast.loading("Uploading PDF...");
      const pdfUrl = await uploadPdfAndGetUrl(file);
      toast.dismiss();

      if (pdfUrl) {
        setPdfFiles((prev) => ({
          ...prev,
          [`${fieldName}_${index}`]: pdfUrl,
        }));
        setFieldValue(`decrees_laws_decisions[${index}].${fieldName}`, pdfUrl);
      }
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
    decrees_laws_decisions:
      initialData.decrees_laws_decisions?.length > 0
        ? initialData.decrees_laws_decisions
        : [{ title_en: "", title_ar: "", pdf_en: "", pdf_ar: "", order: "" }],
  };

  const handleUpdatePage = async (formValues) => {
    try {
      const payload = { page_key: "hierarchy", data: formValues };
      const response = await axiosInstance.put("/V1/pages/update", payload);
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
        {({ values, isSubmitting, setFieldValue }) => (
          <Form>
            {/* Page Details */}
            <Card className="mb-4 shadow-sm">
              <CardHeader className="bg-light fw-bold">Hierarchy Details</CardHeader>
              <CardBody>
                <Row>
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
                        <Field
                          name={name}
                          as={Input}
                          placeholder={`Enter ${label}`}
                        />
                        <ErrorMessage
                          name={name}
                          component="div"
                          className="text-danger small mt-1"
                        />
                      </FormGroup>
                    </Col>
                  ))}
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
                          <Col md="6">
                            <FormGroup>
                              <Label>Title (EN)</Label>
                              <span style={{ color: "red" }}>*</span>
                              <Field
                                name={`decrees_laws_decisions[${index}].title_en`}
                                as={Input}
                                placeholder="Enter Title(en)"
                              />
                              <ErrorMessage
                                name={`decrees_laws_decisions[${index}].title_en`}
                                component="div"
                                className="text-danger small mt-1"
                              />
                            </FormGroup>
                          </Col>

                          <Col md="6">
                            <FormGroup>
                              <Label>Title (AR)</Label>
                              <span style={{ color: "red" }}>*</span>
                              <Field
                                name={`decrees_laws_decisions[${index}].title_ar`}
                                as={Input}
                                placeholder="Enter Title(ar)"
                              />
                              <ErrorMessage
                                name={`decrees_laws_decisions[${index}].title_ar`}
                                component="div"
                                className="text-danger small mt-1"
                              />
                            </FormGroup>
                          </Col>

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
                                    setFieldValue
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
                                    setFieldValue
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

            {/* Confirmation Modal */}
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
