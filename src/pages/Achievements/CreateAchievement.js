import React, { useState, useEffect } from "react";
import { Modal, Switch, DatePicker } from "antd";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ClipLoader } from "react-spinners";
import ReactQuill from "react-quill";
import dayjs from "dayjs";
import { showError } from "helpers/notification_helper";
import "react-quill/dist/quill.snow.css";
import "../../assets/scss/quill-custom.css";


const SUPPORTED_IMAGE_FORMATS = ["image/jpg", "image/jpeg", "image/png"];
const FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Convert file to base64
const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};

const CreateAchievement = ({
    visible,
    handleClose,
    initialData = "",
    onSubmit,
    fieldErrors,
    loading,
}) => {
    const [isSubmitted, setIsSubmitted] = useState(false);

    const formik = useFormik({
        enableReinitialize: true,
        validateOnMount: false,
        validateOnChange: true,
        validateOnBlur: true,
        initialValues: {
            title_en: initialData?.title_en || "",
            title_ar: initialData?.title_ar || "",
            content_en: initialData?.content_en?.replace(/\\\//g, "/") || "",
            content_ar: initialData?.content_ar?.replace(/\\\//g, "/") || "",
            ach_image: "",
            ach_date: initialData?.ach_date || "",
            status: initialData?.status ?? true,
        },
        validationSchema: Yup.object({
            title_en: Yup.string().required("English title is required"),
            title_ar: Yup.string().required("Arabic title is required"),
            content_en: Yup.string()
                .test(
                    "not-empty-html",
                    "English content is required",
                    (value) => {
                        if (!value) return false; // null or undefined
                        // Remove HTML tags and whitespace
                        const stripped = value.replace(/<(.|\n)*?>/g, "").trim();
                        return stripped.length > 0;
                    }
                )
            ,
            content_ar: Yup.string()
                .test(
                    "not-empty-html",
                    "Arabic content is required",
                    (value) => {
                        if (!value) return false;
                        const stripped = value.replace(/<(.|\n)*?>/g, "").trim();
                        return stripped.length > 0;
                    }
                ),
            ach_image: initialData
                ? Yup.mixed()
                    .nullable()
                    .test(
                        "fileSize",
                        "File size too large (max 5MB)",
                        (value) =>
                            !value || typeof value === "string" || value.size <= FILE_SIZE
                    )
                    .test(
                        "fileFormat",
                        "Unsupported Format (JPG/PNG only)",
                        (value) =>
                            !value ||
                            typeof value === "string" ||
                            SUPPORTED_IMAGE_FORMATS.includes(value.type)
                    )
                : Yup.mixed()
                    .nullable()
                    .required("Achievement image is required"),
            ach_date: Yup.date()
                .required("Achievement date is required")
                .typeError("Invalid date format"),
            status: Yup.boolean().required(),
        }),
        onSubmit: async (values, { resetForm }) => {
            const payload = {
                title_en: values.title_en,
                title_ar: values.title_ar,
                content_en: values.content_en,
                content_ar: values.content_ar,
                ach_image: values.ach_image,
                ach_date: values.ach_date,
                status: values.status,
            };

            if (initialData) {
                onSubmit(payload, initialData?.id, resetForm, handleClose);
            } else {
                onSubmit(payload, resetForm, handleClose);
            }
        },
    });

    // Handle external field errors
    useEffect(() => {
        if (fieldErrors) {

            formik.setErrors(fieldErrors);
        }
    }, [fieldErrors]);

    useEffect(() => {
        if (Object.keys(formik.errors).length !== 0 && isSubmitted) {
            console.log(formik.errors);
            showError("Validation Error");
            setIsSubmitted(false);
        }
    }, [formik.errors, isSubmitted]);

    const onClose = () => {
        formik.resetForm();
        handleClose();
    };

    const handleImageChange = async (e) => {
        const file = e.currentTarget.files[0];
        if (file) {
            try {
                const base64 = await fileToBase64(file);
                formik.setFieldValue("ach_image", base64);
            } catch (err) {
                console.error(err);
            }
        } else {
            formik.setFieldValue("ach_image", null);
        }
    };

    // Quill Config (no image upload)
    const quillModules = {
        toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ align: [] }],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link"], //  removed "image"
            ["clean"],
        ],
    };

    const quillFormats = [
        "header",
        "bold",
        "italic",
        "underline",
        "strike",
        "align",
        "list",
        "bullet",
        "link",
    ];

    return (
        <Modal
            title={initialData ? "Edit Achievement" : "Create Achievement"}
            open={visible}
            onCancel={onClose}
            footer={null}
            destroyOnClose
            centered
            width={800}
            maskClosable={false}
            className="custom-modal-header p-0"
        >
            <form onSubmit={formik.handleSubmit}>
                <div className="row g-3">
                    {/* Title EN */}
                    <div className="col-md-6">
                        <label className="form-label fs-7">
                            Title (EN) <span className="text-danger">*</span>
                        </label>
                        <input
                            type="text"
                            name="title_en"
                            className="form-control"
                            value={formik.values.title_en}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="Enter English title"
                        />
                        {formik.touched.title_en && (
                            <div className="text-danger">{formik.errors.title_en}</div>
                        )}
                    </div>

                    {/* Title AR */}
                    <div className="col-md-6">
                        <label className="form-label fs-7">
                            Title (AR) <span className="text-danger">*</span>
                        </label>
                        <input
                            type="text"
                            name="title_ar"
                            className="form-control"
                            value={formik.values.title_ar}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="Enter Arabic title"
                        />
                        {formik.touched.title_ar && (
                            <div className="text-danger">{formik.errors.title_ar}</div>
                        )}
                    </div>

                    {/* Content EN */}
                    <div className="col-12">
                        <label className="form-label fs-7">
                            Content (EN) <span className="text-danger">*</span>
                        </label>
                        <ReactQuill
                            theme="snow"
                            modules={quillModules}
                            formats={quillFormats}
                            value={formik.values.content_en}
                            onChange={(val) => formik.setFieldValue("content_en", val)}
                            style={{ height: "250px", marginBottom: "60px" }}
                        />
                        {formik.touched.content_en && (
                            <div className="text-danger">{formik.errors.content_en}</div>
                        )}
                    </div>

                    {/* Content AR */}
                    <div className="col-12">
                        <label className="form-label fs-7">
                            Content (AR) <span className="text-danger">*</span>
                        </label>
                        <ReactQuill
                            theme="snow"
                            modules={quillModules}
                            formats={quillFormats}
                            value={formik.values.content_ar}
                            onChange={(val) => formik.setFieldValue("content_ar", val)}
                            style={{ height: "250px", marginBottom: "60px" }}
                            dir="rtl"
                        />
                        {formik.touched.content_ar && (
                            <div className="text-danger">{formik.errors.content_ar}</div>
                        )}
                    </div>

                    {/* Achievement Image */}
                    <div className="col-md-6">
                        <label className="form-label fs-7">
                            Achievement Image <span className="text-danger">*</span>
                        </label>
                        <input
                            type="file"
                            name="ach_image"
                            accept="image/jpeg,image/png,image/jpg"
                            className="form-control"
                            onChange={handleImageChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.ach_image && (
                            <div className="text-danger">{formik.errors.ach_image}</div>
                        )}
                        {initialData?.img_url && (
                            <a
                                href={initialData.img_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: "#00A895", textDecoration: "underline" }}
                            >
                                View Uploaded Image
                            </a>
                        )}
                    </div>

                    {/* Achievement Date */}
                    <div className="col-md-6">
                        <label className="form-label fs-7">
                            Achievement Date <span className="text-danger">*</span>
                        </label>
                        <DatePicker
                            className="form-control"
                            format="YYYY-MM-DD"
                            value={formik.values.ach_date ? dayjs(formik.values.ach_date) : null}
                            onChange={(date, dateString) =>
                                formik.setFieldValue("ach_date", dateString)
                            }
                        />
                        {formik.touched.ach_date && (
                            <div className="text-danger">{formik.errors.ach_date}</div>
                        )}
                    </div>

                    {/* Status */}
                    <div className="col-md-6">
                        <label className="form-label fs-7">Status</label>
                        <div>
                            <Switch
                                checked={formik.values.status}
                                onChange={(checked) => formik.setFieldValue("status", checked)}
                                style={{ backgroundColor: formik.values.status ? '#00A895' : undefined }}
                            />

                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="modal-footer mt-4">
                    <button type="button" className="btn btn-light" onClick={onClose}>
                        Close
                    </button>
                    <button
                        type="submit"
                        onClick={() => setIsSubmitted(true)}
                        className="btn btn-primary ms-3"
                        style={{ minWidth: "100px" }}
                        disabled={loading}
                    >
                        {loading ? (
                            <ClipLoader size={18} color="white" />
                        ) : initialData ? (
                            "Update"
                        ) : (
                            "Add"
                        )}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default CreateAchievement;
