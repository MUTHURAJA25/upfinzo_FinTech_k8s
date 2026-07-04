import React, {useEffect, useRef, useState} from "react";
import Wrapper from "../layouts/Wrapper";
import avatar1 from "@/assets/images/illustration/1.png";
import GenerateInputs from "@/components/generateInputs.jsx";
import {FormValidation, FormHandleChange, FormFieldUpdate} from "@/components/formValidator.jsx";
import {useParams} from "react-router-dom";
import {notify} from "@/components/notifications";
import {getUserById} from "@/services/adminService";

function ProfileEdit() {
    const [uploadedAvatar, setUploadedAvatar] = useState(avatar1);
    const [errors, setErrors] = useState({});
    const [isFormValid, setIsFormValid] = useState(false);
    const isFormDirty = useRef(false);
    const {userId} = useParams();
    const button = document.querySelector('.save_button');
    const formFields = {
        first_name: "", last_name: "", email: "", phone_number: "", address: "",
    };

    const [formData, setFormData] = useState({
        formValidation: {},
        formFields
    });

    // Form Validation
    // useEffect(() => {

    //     const fetchData = async () => {
    //         try {

    //             const { data } = await getUserById(userId);
    //             const user = data?.data;
    //             // formFields.firstName = user?.first_name || "";
    //             // formFields.email = user?.email || "";
    //             // formFields.phoneNumber = user?.phone_number || "";
    //             // formFields.address = user?.address || "";
    //             // formFields.dob = user?.dob || "";

    //             formData.formValidation = {};
    //             formData.formFields.firstName = user?.first_name || "";
    //             formData.formFields.email = user?.email || "";
    //             formData.formFields.phoneNumber = user?.phone_number || "";
    //             formData.formFields.address = user?.address || "";
    //             formData.formFields.dob = user?.dob || "";

    //             //    setFormData({'formFields' : {
    //             //         firstName: user?.first_name || "",
    //             //         email: user?.email || "",
    //             //         phoneNumber: user?.phone_number || "",
    //             //         address: user?.address || "",
    //             //         dob: user?.dob || "",
    //             //    }});

    //             isFormDirty.current = true;
    //             const isFormValidated = FormValidation(formData, formFields);

    //             if (isFormValidated === true) {
    //                 setErrors({});
    //                 setIsFormValid(true);
    //                 //  button.disabled = false;
    //             } else {
    //                 console.log(isFormValidated);
    //                 setErrors(isFormValidated);
    //             }

    //             console.log(formData);


    //             // if (user) {
    //             //     setFormData(prev => ({
    //             //         ...prev,
    //             //         formFields: {
    //             //             ...prev.formFields,
    //             //             firstName: user.first_name || "",
    //             //             email: user.email || "",
    //             //             phoneNumber: user.phone_number || "",
    //             //             address: user.address || "",
    //             //             dob: user.dob || "",
    //             //         }
    //             //     }));
    //             // }

    //             // if (!userId) {
    //             //     notify.error("User ID missing from URL!");
    //             //     navigate("/list");
    //             //     return
    //             // } else {
    //             //      console.log(userId);
    //             //     notify.error("User not found!");
    //             // }

    //         } catch (error) {
    //             console.error("Error during async operation:", error);
    //         }
    //     }

    //     fetchData();


    //     // Prevent Initial Render
    //     // if (!isFormDirty.current) {
    //     //     return;
    //     // }

    //     //console.log('coming');


    //     // button.disabled = true;


    // }, [formData]);

    // Get the values from the database and set to forms
    useEffect(() => {
        const fetchData = async () => {
            try {
                const {data} = await getUserById(userId);
                const userData = data?.data;

                setFormData(FormFieldUpdate(formData, userData));
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };
        fetchData();
    }, [userId]);


    // OnChange Validation
    useEffect(() => {
        // Prevent Initial Render
        if (!isFormDirty.current) {
            return;
        }

        button.disabled = true;
        const isFormValidated = FormValidation(formData, formFields);

        if (isFormValidated === true) {
            setErrors({});
            setIsFormValid(true);
            button.disabled = false;
        } else {
            setErrors(isFormValidated);
        }
    }, [formData]);

    /**
     * Initiate the validation
     *
     * @param inputs
     */
    const handleChange = (inputs) => {
        setFormData(FormHandleChange(inputs, formData));

        // For useEffect to start the validation when component renders
        isFormDirty.current = true;
    };

    const compileFields = Object.keys(formFields).reduce((callback, fieldKey) => {
        const config = {
            key: fieldKey,
            name: fieldKey,
            type: 'text',
            id: fieldKey,
            onChange: handleChange,
            required: true,
            error: (errors.formFields && errors.formFields[fieldKey]) ?? '',
            value: formData.formFields[fieldKey]
        };

        // Add more customize conditions
        const conditions = {
            first_name: {
                minLength: 3,
                maxLength: 25
            },
            last_name: {
                minLength: 3,
                maxLength: 25
            },
            email: {
                regex: 'email',
                disabled: true
            },
            phone_number: {
                regex: 'only_number',
                maxLength: '10',
                minLength: '1',
            }
        }[fieldKey] || {};

        callback[fieldKey] = {...config, ...conditions}
        return callback;
    }, {});


    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUploadedAvatar(URL.createObjectURL(file));
        }
    };

    const handleResetImage = () => {
        setUploadedAvatar(avatar1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const newErrors = {};
            if (!formData.first_name.trim()) newErrors.first_name = "First name is required";

            if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);
                notify.error("Please fix the errors below");
                setIsLoading(false);
                return;
            }

            const payload = {
                ...formData,
            };

            await updateUserProfile(userId, payload);
            notify.success("Profile updated successfully!");

        } catch (error) {
            notify.error("Failed to update profile!");
        } finally {
            setTimeout(() => {
                    setIsLoading(false);
                }
                , 1000);
        }
    };

    return (
        <Wrapper page="Profile Management">
            {/* Account Settings Card */}
            <div className="card mb-6">
                <div className="card-body">
                    <div className="d-flex align-items-start align-items-sm-center gap-6">
                        <img
                            src={uploadedAvatar}
                            alt="user-avatar"
                            className="d-block w-px-100 h-px-100 rounded-4"
                            id="uploadedAvatar"
                        />
                        <div className="button-wrapper">
                            <label
                                htmlFor="upload"
                                className="btn btn-primary me-3 mb-4"
                                tabIndex="0"
                            >
                                <span className="d-none d-sm-block">Upload new photo</span>
                                <i className="icon-base ri ri-upload-2-line d-block d-sm-none"></i>

                                <input
                                    type="file"
                                    id="upload"
                                    className="account-file-input"
                                    hidden
                                    accept="image/png, image/jpeg"
                                    onChange={handleImageChange}
                                />
                            </label>
                            <button
                                type="button"
                                className="btn btn-outline-danger account-image-reset mb-4"
                                onClick={handleResetImage}
                            >
                                <i className="icon-base ri ri-refresh-line d-block d-sm-none"></i>
                                <span className="d-none d-sm-block">Reset</span>
                            </button>
                            <div>Allowed JPG, GIF or PNG. Max size of 800K</div>
                        </div>
                    </div>
                </div>
                <div className="card-body pt-0">
                    <form id="formAccountSettings" onSubmit={handleSubmit}>
                        <div className="row mt-1 g-5">
                            {/* First Name */}
                            <div className="col-md-6 form-control-validation">
                                <div className="form-floating form-floating-outline">
                                    <GenerateInputs mapField={compileFields.first_name}/>
                                </div>
                            </div>
                            {/* Last Name */}
                            <div className="col-md-6 form-control-validation">
                                <div className="form-floating form-floating-outline">
                                    <GenerateInputs mapField={compileFields.last_name}/>
                                </div>
                            </div>
                            {/* Email */}
                            <div className="col-md-6">
                                <div className="form-floating form-floating-outline">
                                    <GenerateInputs mapField={compileFields.email}/>
                                </div>
                            </div>
                            {/* Phone Number */}
                            <div className="col-md-6">
                                <div className="form-floating form-floating-outline">
                                    <GenerateInputs mapField={compileFields.phone_number}/>
                                </div>
                            </div>

                            {/* Address */}
                            <div className="col-md-6">
                                <div className="form-floating form-floating-outline">
                                    <GenerateInputs mapField={compileFields.address}/>
                                </div>
                            </div>
                        </div>
                        <div className="mt-6">
                            <button type="submit" disabled={true} className="btn save_button btn-primary me-3">
                                Save changes
                            </button>
                            <button type="cancel" className="btn btn-outline-danger">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>

        </Wrapper>
    );
}

export default ProfileEdit;