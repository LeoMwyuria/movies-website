import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate } from 'react-router-dom';
import picture from '../assets/Movie.png';
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
interface FormValues {
    email: string;
    password: string;
    repeatPassword: string;
}

const SignUp: React.FC = () => {
    
    const navigation = useNavigate();

    const toLoginClick = () => {
        navigation("/");
    };

    const handleSignUp = async (values: FormValues) => {
        try {
            const auth = getAuth();
            const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
            const user = userCredential.user;
            console.log('User registered successfully:', user);
            
            navigation("/Home");
    
          
            const db = getDatabase();
            await set(ref(db, 'users/' + user.uid), {
                email: user.email,
               
            });
    
           
        } catch (error: any) {
            const errorMessage: string = (error instanceof Error) ? error.message : 'An unknown error occurred';
            console.error('Error registering user:', errorMessage);
        }
    };

    return (
        <div className="loginPage">
            <div className="pictureDiv"><img src={picture} alt="" /></div>
            <div className="login">
                <div className="pDiv"><p>Sign Up</p></div>
                <Formik
                    initialValues={{ email: '', password: '', repeatPassword: '' }}
                    validate={values => {
                        const errors: Partial<FormValues> = {};
                        if (!values.email) {
                            errors.email = 'Required';
                        } else if (!/^\S+@\S+\.\S+$/.test(values.email)) {
                            errors.email = 'Invalid email address';
                        }
                        if (!values.password) {
                            errors.password = 'Required';
                        } else if (values.password.length < 6) {
                            errors.password = 'Password must be at least 6 characters';
                        }
                        if (!values.repeatPassword) {
                            errors.repeatPassword = 'Required';
                        } else if (values.repeatPassword !== values.password) {
                            errors.repeatPassword = 'Passwords do not match';
                        }
                        return errors;
                    }}
                    onSubmit={handleSignUp}
                >
                    <Form className='formLogin'>
                        <Field type="email" name="email" placeholder="Email Address" className="email" />
                        <ErrorMessage name="email" component="div" className="error" />

                        <Field type="password" name="password" placeholder="Password" className="password" />
                        <ErrorMessage name="password" component="div" className="error" />

                        <Field type="password" name="repeatPassword" placeholder="Repeat Password" className="password" />
                        <ErrorMessage name="repeatPassword" component="div" className="error" />

                        <button type="submit" className='loginBtn'>create new account</button>
                    </Form>
                </Formik>
                <div className='toSignup'>Already Have An Account? <span onClick={toLoginClick} style={{ color: 'rgba(252, 71, 71, 1)' }}>Login</span></div>
            </div>
        </div>
    );
};

export default SignUp;
