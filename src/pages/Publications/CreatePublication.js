import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import { useFormik } from "formik";
import * as Yup from "yup";
import Switch from "react-switch";
import Select from "react-select";

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

const CreatePublication = ({ visible, handleClose, initialData = "", onSubmit ,classifications,fieldErrors}) => {
    const [type, setType] = useState(initialData?.type || "");

    const formik = useFormik({
        initialValues: {
            title_en: initialData?.title_en || "",
                title_ar: initialData?.title_ar || "",
                cover_image: null,
                pdf_file:  null,
                show_in_home: initialData?.show_in_home || false,
                classification_id: initialData?.classification_id || "",
                type: initialData?.type || "",
        },
        validationSchema: Yup.object({
            title_en: Yup.string().required("Title is required"),
            title_ar: Yup.string().required("Title in Arabic is required"),
            cover_image: initialData ? Yup.mixed()
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
            pdf_file: initialData ? Yup.mixed()
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
            classification_id: Yup.string().required("Select a classification"),
            type: Yup.string().required("Please select one type"),
        }),
        onSubmit: (values,{resetForm}) => {
            const payload = {
                title_en: values?.title_en,
                title_ar: values.title_ar,
                cover_image: values.cover_image,
                pdf_file: values.pdf_file,
                show_in_home: values.show_in_home,
                classification_id: values.classification_id,
                type: values.type,
            }
            if(initialData){
                onSubmit(payload,initialData?.id,resetForm,handleClose);
            }else{
                onSubmit(payload,resetForm,handleClose);
            }
        },
    });

    useEffect(()=>{
        if(fieldErrors){
            formik.setErrors(fieldErrors);
        }
    },[fieldErrors])

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
                formik.setFieldValue("cover_image", base64);
            } catch (err) {
                console.error(err);
            }
        } else {
            formik.setFieldValue("cover_image", null);
        }
    };

    // Convert and set pdf to base64
    const handlePdfChange = async (e) => {
        const file = e.currentTarget.files[0];
        if (file) {
            try {
                const base64 = await fileToBase64(file);
                formik.setFieldValue("pdf_file", base64);
            } catch (err) {
                console.error(err);
            }
        } else {
            formik.setFieldValue("pdf_file", null);
        }
    };

    // Update form values if initialData changes
    useEffect(() => {
        if (initialData?.title_en) {
            formik.setValues({
                title_en: initialData?.title_en || "",
                title_ar: initialData?.title_ar || "",
                cover_image:  null,
                pdf_file: null,
                show_in_home: initialData?.show_in_home || false,
                classification_id: initialData?.classification_id || "",
                type: initialData?.type || "",
            });
            setType(initialData?.type || "");
        }
    }, [initialData]);

    return (
        <Modal
            title={initialData?.title_en ? "Edit Publication" : "Create New Publication"}
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
                            name="title_en"
                            className="form-control"
                            value={formik.values.title_en}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="Enter the title"
                        />
                        {(
                            <div className="text-danger">{formik.errors?.title_en||formik.errors?.title_en?.[0]}</div>
                        )}
                    </div>

                    {/* Arabic Title */}
                    <div className="col-md-6">
                        <label className="form-label fs-7">
                            Title (Ar) <span className="text-danger">*</span>
                        </label>
                        <input
                            type="text"
                            name="title_ar"
                            className="form-control"
                            value={formik.values.title_ar}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="Enter title in arabic"
                        />
                        {(
                            <div className="text-danger">{formik.errors.title_ar || formik.errors?.title_ar?.[0]}</div>
                        )}
                    </div>

                    {/* Cover Image */}
                    <div className="col-md-6">
                        <label className="form-label fs-7">Cover Image</label> {!initialData && <span className="text-danger">*</span>}
                        <input
                            type="file"
                            name="cover_image"
                            accept="image/jpeg,image/png,image/jpg"
                            className="form-control"
                            onChange={handleCoverImageChange}
                            onBlur={formik.handleBlur}
                        />
                        {(
                            <div className="text-danger">{formik.errors.cover_image || formik.errors?.cover_image?.[0]}</div>
                        )}
                    </div>

                    {/* PDF */}
                    <div className="col-md-6">
                        <label className="form-label fs-7">PDF</label>{!initialData && <span className="text-danger">*</span>}
                        <input
                            type="file"
                            name="pdf_file"
                            accept="application/pdf"
                            className="form-control"
                            onChange={handlePdfChange}
                            onBlur={formik.handleBlur}
                        />
                        {(
                            <div className="text-danger">{formik.errors.pdf_file || formik.errors.pdf_file?.[0]}</div>
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
                        {(
                            <div className="text-danger">{formik.errors.type || formik.errors.type?.[0]}</div>
                        )}
                    </div>

                    {/* Classifications Single Select */}
                    <div className="col-md-6">
                        <label className="form-label fs-7">
                            Classifications <span className="text-danger">*</span>
                        </label>
                        <Select
                            options={classifications}
                            value={classifications?.find(
                                (option) => option.value === formik.values.classification_id
                            ) || null}
                            onChange={(selectedOption) =>
                                formik.setFieldValue("classification_id", selectedOption?.value || "")
                            }
                            classNamePrefix="select"
                            isClearable={true}
                        />
                        {formik.touched.classification_id && formik.errors.classification_id && (
                            <div className="text-danger">{formik.errors.classification_id}</div>
                        )}
                    </div>

                    {/* Show in Home Toggle */}
                    <div className="col-md-6 d-flex align-items-center">
                        <label className="form-label me-3 fs-7">Show in Home</label>
                        <Switch
                            onChange={(checked) => formik.setFieldValue("show_in_home", checked)}
                            checked={formik.values.show_in_home}
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
                        {initialData?.title_en ? "Update" : "Add"}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default CreatePublication;
