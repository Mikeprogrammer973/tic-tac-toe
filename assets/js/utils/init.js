
export const home_init = () => {
    const signinTab = document.getElementById('tab-signin');
    const signupTab = document.getElementById('tab-signup');
    const signinForm = document.getElementById('form-signin');
    const signupForm = document.getElementById('form-signup');

    signinTab.addEventListener('click', () => {
    signinForm.classList.remove('hidden');
    signupForm.classList.add('hidden');
    signinTab.classList.add('bg-indigo-600');
    signupTab.classList.remove('bg-indigo-600');
    signupTab.classList.add('bg-gray-800');
    signinTab.classList.remove('bg-gray-800');
    });

    signupTab.addEventListener('click', () => {
    signupForm.classList.remove('hidden');
    signinForm.classList.add('hidden');
    signupTab.classList.add('bg-indigo-600');
    signinTab.classList.remove('bg-indigo-600');
    signinTab.classList.add('bg-gray-800');
    signupTab.classList.remove('bg-gray-800');
    });
}