// =====================================================
// WANDERLYST - AUTHENTICATION SERVICE
// =====================================================
//
// Handles:
// - Sign up
// - Login
// - Logout
// - Current user
//
// Supabase connection will be added later.
// =====================================================


/**
 * Create a new user account
 *
 * @param {string} email
 * @param {string} password
 * @param {string} fullName
 */
async function signUp(
    email,
    password,
    fullName
) {

    try {

        // Supabase connection will be used here later.

        console.log(
            "Signup requested:",
            email
        );

        return {

            success: true,

            message:
                "Signup service is ready for Supabase integration."

        };

    } catch (error) {

        console.error(
            "Signup error:",
            error
        );

        return {

            success: false,

            message:
                error.message

        };

    }

}


/**
 * Login an existing user
 *
 * @param {string} email
 * @param {string} password
 */
async function login(
    email,
    password
) {

    try {

        // Supabase authentication
        // will be connected here.

        console.log(
            "Login requested:",
            email
        );

        return {

            success: true,

            message:
                "Login service is ready for Supabase integration."

        };

    } catch (error) {

        console.error(
            "Login error:",
            error
        );

        return {

            success: false,

            message:
                error.message

        };

    }

}


/**
 * Logout current user
 */
async function logout() {

    try {

        console.log(
            "Logout requested"
        );

        return {

            success: true,

            message:
                "Logout service is ready."

        };

    } catch (error) {

        console.error(
            "Logout error:",
            error
        );

        return {

            success: false,

            message:
                error.message

        };

    }

}


/**
 * Get currently logged-in user
 */
async function getCurrentUser() {

    try {

        console.log(
            "Getting current user"
        );

        return {

            success: true,

            user: null

        };

    } catch (error) {

        console.error(
            "Current user error:",
            error
        );

        return {

            success: false,

            user: null,

            message:
                error.message

        };

    }

}


/**
 * Check whether a user is logged in
 */
async function isLoggedIn() {

    const result =
        await getCurrentUser();


    return (
        result.success &&
        result.user !== null
    );

}


/* =====================================================
   EXPORTS
===================================================== */

if (
    typeof module !== "undefined" &&
    module.exports
) {

    module.exports = {

        signUp,

        login,

        logout,

        getCurrentUser,

        isLoggedIn

    };

}