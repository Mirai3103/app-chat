const base = (message: string, className: string) => {
    const Toast = document.createElement('div');
    Toast.className = className;
    Toast.innerHTML = message;
    Toast.id = 'toast';
    const app = document.querySelector('#root');
    if (app) {
        app.appendChild(Toast);
        setTimeout(() => {
            Toast.remove();
        }, 10000);
    }
}
const success = (message: string) => {
    base(message, 'show background-success border border-success shadow shadow-hover text-primary');
};
const error = (message: string) => {
    base(message, 'show background-danger border border-danger shadow shadow-hover text-primary ');
};

export default {
    success,
    error
} as const;