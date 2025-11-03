import React, { useState, useEffect } from "react";
import { Modal, Switch } from "antd";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { ClipLoader } from "react-spinners";
import { showError } from "helpers/notification_helper";

const FILE_SIZE = 20 * 1024 * 1024; // 20MB
const SUPPORTED_FORMATS = ["application/pdf"];
const SUPPORTED_IMAGE_FORMATS = ["image/jpg", "image/jpeg", "image/png"];

const toBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

const CreateGuideClassification = ({
    visible,
    handleClose,
    initialData = "",
    onSubmit,
    fieldErrors,
    loading,
}) => {
    const { t } = useTranslation();
    const [isSubmitted, setIsSubmitted] = useState(false);

    const formik = useFormik({
        initialValues: {
            title_en: initialData?.title_en || "",
            title_ar: initialData?.title_ar || "",
            cover_image: "",
            pdf_file: "",
            pdf_file_ar: "",
            status: initialData?.status ?? true,
        },
        enableReinitialize: true,
        validationSchema: Yup.object({
            title_en: Yup.string().required("Title is required"),
            title_ar: Yup.string().required("Title in Arabic is required"),

            cover_image: Yup.mixed()
                .test(
                    "fileRequired",
                    "Cover image is required",
                    (value) => !!value || !!initialData // allow empty if editing
                )
                .test(
                    "fileSize",
                    "File size is too large, max 20MB",
                    (value) => !value || value.size <= FILE_SIZE
                )
                .test(
                    "fileFormat",
                    "Unsupported Format, only JPG/PNG allowed",
                    (value) => !value || SUPPORTED_IMAGE_FORMATS.includes(value.type)
                ),

            pdf_file: Yup.mixed()
                .test(
                    "fileRequired",
                    "PDF file is required",
                    (value) => !!value || !!initialData // allow empty if editing
                )
                .test(
                    "fileFormat",
                    "Unsupported Format, only PDF allowed",
                    (value) => !value || SUPPORTED_FORMATS.includes(value.type)
                ),

            pdf_file_ar: Yup.mixed()
                .test(
                    "fileRequired",
                    "PDF Arabic file is required",
                    (value) => !!value || !!initialData // allow empty if editing
                )
                .test(
                    "fileFormat",
                    "Unsupported Format, only PDF allowed",
                    (value) => !value || SUPPORTED_FORMATS.includes(value.type)
                ),

            status: Yup.boolean().required("Status is required"),
        }),
        onSubmit: async (values, { resetForm }) => {
            let base64Cover = null;
            let base64Pdf = null;
            let base64PdfAr = null;

            if (values.cover_image) base64Cover = await toBase64(values.cover_image);
            if (values.pdf_file) base64Pdf = await toBase64(values.pdf_file);
            if (values.pdf_file_ar) base64PdfAr = await toBase64(values.pdf_file_ar);

            const payload = {
                title_en: values.title_en,
                title_ar: values.title_ar,
                cover_image: base64Cover,
                pdf_file: base64Pdf,
                pdf_file_ar: base64PdfAr,
                status: values.status,
            };

            if (initialData) {
                onSubmit(payload, initialData.id, resetForm, onClose);
            } else {
                onSubmit(payload, resetForm, onClose);
            }
        },
    });

    useEffect(() => {
        if (Object.keys(formik.errors).length !== 0 && isSubmitted) {
            showError("Validation Error");
            setIsSubmitted(false);
        }
    }, [formik.errors, isSubmitted]);

    useEffect(() => {
        if (fieldErrors) {
            formik.setErrors(fieldErrors);
        }
    }, [fieldErrors]);

    const onClose = () => {
        formik.resetForm();
        handleClose();
    };

    return (
        <Modal
            title={initialData ? t("Edit Guide Classification") : t("Create Guide Classification")}
            visible={visible}
            onCancel={onClose}
            footer={null}
            destroyOnClose
            centered
            width={600}
            className="custom-modal-header p-0 my-5"
            maskClosable={false}
        >
            <form onSubmit={formik.handleSubmit}>
                <div className="row g-3">
                    {/* Title EN */}
                    <div className="col-md-6">
                        <label className="form-label fs-7">
                            {t("Title (EN)")} <span className="text-danger">*</span>
                        </label>
                        <input
                            name="title_en"
                            className="form-control"
                            value={formik.values.title_en}
                            onChange={formik.handleChange}
                            placeholder="Enter title"
                        />
                        {formik.touched.title_en && (
                            <div className="text-danger">{formik.errors.title_en}</div>
                        )}
                    </div>

                    {/* Title AR */}
                    <div className="col-md-6">
                        <label className="form-label fs-7">
                            {t("Title (AR)")} <span className="text-danger">*</span>
                        </label>
                        <input
                            name="title_ar"
                            className="form-control"
                            value={formik.values.title_ar}
                            onChange={formik.handleChange}
                            placeholder="Enter title in Arabic"
                        />
                        {formik.touched.title_ar && (
                            <div className="text-danger">{formik.errors.title_ar}</div>
                        )}
                    </div>

                    {/* Cover Image */}
                    <div className="col-md-6">
                        <label className="form-label fs-7">
                            {t("Cover Image")} <span className="text-danger">*</span>
                        </label>
                        <input
                            type="file"
                            name="cover_image"
                            className="form-control"
                            accept="image/jpeg,image/png,image/jpg"
                            onChange={(e) =>
                                formik.setFieldValue("cover_image", e.currentTarget.files[0])
                            }
                        />
                        {initialData?.cover_image_url && (
                            <a
                                href={initialData.cover_image_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="d-block mt-2 text-primary"
                            >
                                View Image
                            </a>
                        )}
                        {formik.touched.cover_image && (
                            <div className="text-danger">{formik.errors.cover_image}</div>
                        )}
                    </div>

                    {/* PDF EN */}
                    <div className="col-md-6">
                        <label className="form-label fs-7">
                            {t("PDF File (EN)")} <span className="text-danger">*</span>
                        </label>
                        <input
                            type="file"
                            name="pdf_file"
                            className="form-control"
                            accept="application/pdf"
                            onChange={(e) =>
                                formik.setFieldValue("pdf_file", e.currentTarget.files[0])
                            }
                        />
                        {initialData?.pdf_file_url && (
                            <a
                                href={initialData.pdf_file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="d-block mt-2 text-primary"
                            >
                                View English PDF
                            </a>
                        )}
                        {formik.touched.pdf_file && (
                            <div className="text-danger">{formik.errors.pdf_file}</div>
                        )}
                    </div>

                    {/* PDF AR */}
                    <div className="col-md-6">
                        <label className="form-label fs-7">
                            {t("PDF File (AR)")} <span className="text-danger">*</span>
                        </label>
                        <input
                            type="file"
                            name="pdf_file_ar"
                            className="form-control"
                            accept="application/pdf"
                            onChange={(e) =>
                                formik.setFieldValue("pdf_file_ar", e.currentTarget.files[0])
                            }
                        />
                        {initialData?.pdf_file_url_ar && (
                            <a
                                href={initialData.pdf_file_url_ar}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="d-block mt-2 text-primary"
                            >
                                View Arabic PDF
                            </a>
                        )}
                        {formik.touched.pdf_file_ar && (
                            <div className="text-danger">{formik.errors.pdf_file_ar}</div>
                        )}
                    </div>

                    {/* Status Toggle */}
                    <div className="col-md-6 d-flex align-items-center">
                        <div>
                            <label className="form-label fs-7 d-block">{t("Status")}</label>
                            <Switch
                                checked={formik.values.status}
                                onChange={(checked) => formik.setFieldValue("status", checked)}
                                style={{
                                    backgroundColor: formik.values.status ? "#00A895" : undefined,
                                }}
                            />
                            {formik.touched.status && (
                                <div className="text-danger">{formik.errors.status}</div>
                            )}
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <div className="modal-footer mt-4">
                    <button type="button" className="btn btn-light" onClick={onClose}>
                        {t("Close")}
                    </button>
                    <button
                        type="submit"
                        onClick={() => setIsSubmitted(true)}
                        className="btn btn-primary ms-3"
                        style={{ minWidth: "100px" }}
                        disabled={loading}
                    >
                        {loading ? (
                            <ClipLoader color="white" size={18} />
                        ) : initialData ? (
                            t("Update")
                        ) : (
                            t("Add")
                        )}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default CreateGuideClassification;
