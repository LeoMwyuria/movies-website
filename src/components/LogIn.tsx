import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate } from 'react-router-dom';
import picture from '../assets/Movie.png';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, get } from "firebase/database";

interface FormValues {
    email: string;
    password: string;
}

const LogIn: React.FC = () => {
    const navigation = useNavigate();
    const [loginError, setLoginError] = useState<string | null>(null);

    const toSignUpClick = () => {
        navigation("/signup");
    };

    const handleLogin = async (values: FormValues, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
        try {
            const auth = getAuth();
            const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
            const user = userCredential.user;
            console.log('User logged in successfully:', user);
            navigation("/Home");
    
            const db = getDatabase();
            const userRef = ref(db, 'users/' + user.uid);
            const snapshot = await get(userRef);

    
            if (snapshot.exists()) {
                const userData = snapshot.val();
                console.log('User data:', userData);
            } else {
                console.log('No user data found');
            }
    
           
            setLoginError(null); 
            setSubmitting(false); 
            console.log("Navigating to Home...");
           
        } catch (error: any) {
            console.error('Error logging in:', error.message);
            setLoginError('Your email or password is incorrect');
            setSubmitting(false); 
        }
    };
    
    return (
        <div className="loginPage">
            <div className="pictureDiv"><img src={picture} alt="" /></div>
            <div className="login">
                <div className="pDiv"><p>Login</p></div>
                <Formik
                    initialValues={{ email: '', password: '' }}
                    validate={values => {
                        const errors: Partial<FormValues> = {};
                        if (!values.email) {
                            errors.email = 'Required';
                        } else if (!/^\S+@\S+\.\S+$/.test(values.email)) {
                            errors.email = 'Invalid email address';
                        }
                        if (!values.password) {
                            errors.password = 'Required';
                        }
                        return errors;
                    }}
                    onSubmit={handleLogin}
                >
                    {({ isSubmitting }) => (
                        <Form className='formLogin'>
                            <Field type="email" name="email" placeholder="Email Address" className="email" />
                            <ErrorMessage name="email" component="div" className="error" />

                            <Field type="password" name="password" placeholder="Password" className="password" />
                            <ErrorMessage name="password" component="div" className="error" />

                            {loginError && <div className="error">{loginError}</div>} 
                            {isSubmitting && <div className="error">Logging in...</div>}
                            <button type="submit" className='loginBtn' disabled={isSubmitting}>Login to your account</button>
                        </Form>
                    )}
                </Formik>
                <div className='toSignup'>Don't have an account? <span onClick={toSignUpClick} style={{ color: 'rgba(252, 71, 71, 1)' }}>Sign Up</span></div>
            </div>
        </div>
    );
};

export default LogIn;
