
export class Render
{
    notification()
    {

    }

    async page(el, dir, util = () => {})
    {
        el.innerHTML = await (await fetch(dir)).text()
        util()
    }
}