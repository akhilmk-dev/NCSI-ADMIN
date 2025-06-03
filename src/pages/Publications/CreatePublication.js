import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import { useFormik } from "formik";
import * as Yup from "yup";
import Switch from "react-switch";
import Select from "react-select";

const dummyClassifications = [
    { value: "fiction", label: "Fiction" },
    { value: "non-fiction", label: "Non-Fiction" },
    { value: "science", label: "Science" },
    { value: "technology", label: "Technology" },
];

const FILE_SIZE = 5 * 1024 * 1024; // 5MB max
const SUPPORTED_IMAGE_FORMATS = ["image/jpg", "image/jpeg", "image/png"];
const SUPPORTED_PDF_FORMAT = "application/pdf";

// Helper to convert file to base64 string
const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};

const CreatePublication = ({ visible, handleClose, initialData = "", onSubmit }) => {
    const [type, setType] = useState(initialData?.type || "book");

    const formik = useFormik({
        initialValues: {
            title: initialData?.title || "",
            titleAr: initialData?.titleAr || "",
            coverImage: initialData?.coverImage || null, // base64 string or null
            pdf: initialData?.pdf || null, // base64 string or null
            showInHome: initialData?.showInHome || false,
            classifications: initialData?.classifications || "",
            type: initialData?.type || "book",
        },
        validationSchema: Yup.object({
            title: Yup.string().required("Title is required"),
            titleAr: Yup.string().required("Title in Arabic is required"),
            coverImage: initialData ? Yup.mixed()
                .nullable()
                .test("fileSize", "File size is too large, max 5MB", (value) => {
                    if (!value || typeof value === "string") return true;
                    return value.size <= FILE_SIZE;
                })
                .test("fileFormat", "Unsupported Format, only JPG/PNG allowed", (value) => {
                    if (!value || typeof value === "string") return true;
                    return SUPPORTED_IMAGE_FORMATS.includes(value.type);
                }) : Yup.mixed()
                    .nullable()
                    .test("fileSize", "File size is too large, max 5MB", (value) => {
                        if (!value || typeof value === "string") return true;
                        return value.size <= FILE_SIZE;
                    })
                    .test("fileFormat", "Unsupported Format, only JPG/PNG allowed", (value) => {
                        if (!value || typeof value === "string") return true;
                        return SUPPORTED_IMAGE_FORMATS.includes(value.type);
                    }).required("Cover image is required"),
            pdf: initialData ? Yup.mixed()
                .nullable()
                .test("fileSize", "File size is too large, max 5MB", (value) => {
                    if (!value || typeof value === "string") return true;
                    return value.size <= FILE_SIZE;
                })
                .test("fileFormat", "Unsupported Format, only PDF allowed", (value) => {
                    if (!value || typeof value === "string") return true;
                    return value.type === SUPPORTED_PDF_FORMAT;
                }) : Yup.mixed()
                    .nullable()
                    .test("fileSize", "File size is too large, max 5MB", (value) => {
                        if (!value || typeof value === "string") return true;
                        return value.size <= FILE_SIZE;
                    })
                    .test("fileFormat", "Unsupported Format, only PDF allowed", (value) => {
                        if (!value || typeof value === "string") return true;
                        return value.type === SUPPORTED_PDF_FORMAT;
                    }).required("Pdf is required"),
            classifications: Yup.string().required("Select a classification"),
            type: Yup.string().required("Please select one type"),
        }),
        onSubmit: (values) => {
            onSubmit({
                title: values.title,
                titleAr: values.titleAr,
                coverImage: values.coverImage,
                pdf: values.pdf,
                showInHome: values.showInHome,
                classifications: values.classifications,
                type: values.type,
            });
            onClose();
        },
    });

    const onClose = () => {
        formik.resetForm();
        handleClose();
    };

    // Convert and set cover image to base64
    const handleCoverImageChange = async (e) => {
        const file = e.currentTarget.files[0];
        if (file) {
            try {
                const base64 = await fileToBase64(file);
                formik.setFieldValue("coverImage", base64);
            } catch (err) {
                console.error(err);
            }
        } else {
            formik.setFieldValue("coverImage", null);
        }
    };

    // Convert and set pdf to base64
    const handlePdfChange = async (e) => {
        const file = e.currentTarget.files[0];
        if (file) {
            try {
                const base64 = await fileToBase64(file);
                formik.setFieldValue("pdf", base64);
            } catch (err) {
                console.error(err);
            }
        } else {
            formik.setFieldValue("pdf", null);
        }
    };

    // Update form values if initialData changes
    useEffect(() => {
        if (initialData?.title) {
            formik.setValues({
                title: initialData.title || "",
                titleAr: initialData.titleAr || "",
                coverImage: initialData.coverImage || null,
                pdf: initialData.pdf || null,
                showInHome: initialData.showInHome || false,
                classifications: initialData.classifications || "",
                type: initialData.type || "book",
            });
            setType(initialData.type || "book");
        }
    }, [initialData]);

    return (
        <Modal
            title={initialData?.title ? "Edit Publication" : "Create New Publication"}
            visible={visible}
            onCancel={onClose}
            footer={null}
            destroyOnClose
            centered
            width={700}
            maskClosable={false}
            className="custom-modal-header p-0"
        >
            <form onSubmit={formik.handleSubmit}>
                <div className="row g-3">
                    {/* English Title */}
                    <div className="col-md-6">
                        <label className="form-label fs-7">
                            Title <span className="text-danger">*</span>
                        </label>
                        <input
                            type="text"
                            name="title"
                            className="form-control"
                            value={formik.values.title}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.title && formik.errors.title && (
                            <div className="text-danger">{formik.errors.title}</div>
                        )}
                    </div>

                    {/* Arabic Title */}
                    <div className="col-md-6">
                        <label className="form-label fs-7">
                            Title (Ar) <span className="text-danger">*</span>
                        </label>
                        <input
                            type="text"
                            name="titleAr"
                            className="form-control"
                            value={formik.values.titleAr}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.titleAr && formik.errors.titleAr && (
                            <div className="text-danger">{formik.errors.titleAr}</div>
                        )}
                    </div>

                    {/* Cover Image */}
                    <div className="col-md-6">
                        <label className="form-label fs-7">Cover Image</label> {!initialData && <span className="text-danger">*</span>}
                        <input
                            type="file"
                            name="coverImage"
                            accept="image/jpeg,image/png,image/jpg"
                            className="form-control"
                            onChange={handleCoverImageChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.coverImage && formik.errors.coverImage && (
                            <div className="text-danger">{formik.errors.coverImage}</div>
                        )}
                    </div>

                    {/* PDF */}
                    <div className="col-md-6">
                        <label className="form-label fs-7">PDF</label>{!initialData && <span className="text-danger">*</span>}
                        <input
                            type="file"
                            name="pdf"
                            accept="application/pdf"
                            className="form-control"
                            onChange={handlePdfChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.pdf && formik.errors.pdf && (
                            <div className="text-danger">{formik.errors.pdf}</div>
                        )}
                    </div>

                    {/* Type Radio Buttons */}
                    <div className="col-md-12">
                        <label className="form-label fs-7">
                            Type <span className="text-danger">*</span>
                        </label>
                        <div role="group" aria-labelledby="type-radio-group">
                            <label className="me-3">
                                <input
                                    type="radio"
                                    name="type"
                                    value="book"
                                    checked={formik.values.type === "book"}
                                    onChange={(e) => {
                                        formik.setFieldValue("type", e.target.value);
                                        setType(e.target.value);
                                    }}
                                    onBlur={formik.handleBlur}
                                />{" "}
                                Book
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="type"
                                    value="url"
                                    checked={formik.values.type === "url"}
                                    onChange={(e) => {
                                        formik.setFieldValue("type", e.target.value);
                                        setType(e.target.value);
                                    }}
                                    onBlur={formik.handleBlur}
                                />{" "}
                                URL
                            </label>
                        </div>
                        {formik.touched.type && formik.errors.type && (
                            <div className="text-danger">{formik.errors.type}</div>
                        )}
                    </div>

                    {/* Classifications Single Select */}
                    <div className="col-md-6">
                        <label className="form-label fs-7">
                            Classifications <span className="text-danger">*</span>
                        </label>
                        <Select
                            options={dummyClassifications}
                            value={dummyClassifications.find(
                                (option) => option.value === formik.values.classifications
                            ) || null}
                            onChange={(selectedOption) =>
                                formik.setFieldValue("classifications", selectedOption?.value || "")
                            }
                            classNamePrefix="select"
                            isClearable={true}
                        />
                        {formik.touched.classifications && formik.errors.classifications && (
                            <div className="text-danger">{formik.errors.classifications}</div>
                        )}
                    </div>

                    {/* Show in Home Toggle */}
                    <div className="col-md-6 d-flex align-items-center">
                        <label className="form-label me-3 fs-7">Show in Home</label>
                        <Switch
                            onChange={(checked) => formik.setFieldValue("showInHome", checked)}
                            checked={formik.values.showInHome}
                            uncheckedIcon={false}
                            checkedIcon={false}
                            height={20}
                            width={40}
                            handleDiameter={20}
                        />
                    </div>

                    {/* Optional: you can add conditional input for URL if type==="url" */}
                </div>

                <div className="modal-footer mt-4">
                    <button type="button" className="btn btn-light" onClick={onClose}>
                        Close
                    </button>
                    <button type="submit" className="btn btn-primary ms-3">
                        {initialData?.title ? "Update" : "Add"}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default CreatePublication;
