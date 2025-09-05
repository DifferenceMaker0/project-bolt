import './assets/main.css'
import './assets/base.css'
import { createVNode, render } from 'vue';

import { createApp } from 'vue'
import App from './App.vue'

// create fake mount point
const $app = document.createElement('div');
$app.id = 'app';
$app.style.display = 'none';
document.body.appendChild($app);
const app = createApp(App).mount('#app');

const components = import.meta.glob('./**/*.vue');
for (const path in components) {

    const tag = path.match(/([^/]+).vue/)?.[1].split(/(?=[A-Z])/g).join('-');
    const { default: component } = await components[path]();

    document.querySelectorAll(tag).forEach(elem => {

        const props = [...elem.attributes].filter(attr => attr.name[0] === ':').reduce((props, attr) => {
            props[attr.name.slice(1)] = attr.value;
            return props;
        }, {});
        mountComponent(app, elem, component, props);

        // move the component's DOM before the mount element
        [...elem.children].forEach(child => elem.parentNode.insertBefore(child, elem));

        // remove the mount element not to clutter the page
        elem.remove();
    });

}

function mountComponent(app, elem, component, props) {

    let vNode = createVNode(component, props);
    vNode.appContext = app._context;
    render(vNode, elem);
    return vNode.component;
}
