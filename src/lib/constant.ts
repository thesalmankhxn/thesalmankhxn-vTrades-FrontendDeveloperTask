export enum AUTH_LAYOUT_TYPE {
    SIGN_IN = 'sign-in',
    SIGN_UP = 'sign-up',
    FORGOT_PASSWORD = 'forgot-password',
    OTP_VERIFICATION = 'otp-verification',
    CREATE_NEW_PASSWORD = 'create-new-password'
}

export const AUTH_LAYOUT_INFO = (type: AUTH_LAYOUT_TYPE, email?: string) => {
    const info = {
        title: '',
        subtext: ''
    };

    switch (type) {
        case AUTH_LAYOUT_TYPE.SIGN_IN: {
            info.title = 'Sign In';
            info.subtext = 'Manage your workspace seamlessly. Sign in to continue.';
            break;
        }
        case AUTH_LAYOUT_TYPE.SIGN_UP: {
            info.title = 'Sign Up';
            info.subtext = 'Manage your workspace seamlessly. Sign in to continue.';
            break;
        }
        case AUTH_LAYOUT_TYPE.FORGOT_PASSWORD: {
            info.title = 'Forgot Your Password?';
            info.subtext = 'Don’t worry! Enter your email address, and we’ll send you a link to reset it.';
            break;
        }
        case AUTH_LAYOUT_TYPE.OTP_VERIFICATION: {
            info.title = 'Enter OTP';
            info.subtext = `Enter the OTP that we have sent to your email address ${email}.`;
            break;
        }
        case AUTH_LAYOUT_TYPE.CREATE_NEW_PASSWORD: {
            info.title = 'Create New Password';
            info.subtext =
                'Choose a strong and secure password to keep your account safe. Make sure it’s easy for you to remember, but hard for others to guess!';
            break;
        }
    }

    return info;
};
