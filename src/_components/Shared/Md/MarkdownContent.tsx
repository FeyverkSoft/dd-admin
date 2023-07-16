import * as React from 'react';
import memoize from "lodash.memoize";
import style from "./md.module.scss";
import { Instagram } from '../Instagram/Instagram';
import { GMaps } from '../GMaps/GMaps';
import { ReactLink } from '../ReactLink/ReactLink';

class Element {
    element: any;
    constructor(element: any) {
        this.element = element;
    }
    public get key(): number | string {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4();
    }
}
class Token extends Element {
    content: any;
    onlyText: boolean;
    component: any;
    className: string | undefined;
    tabIndex?: number;
    strict?: boolean = true;
    constructor(element: any, content?: any, component?: any, onlyText: boolean = false, className: string | undefined = undefined, tabIndex?: number) {
        super(element);
        this.component = component || false;
        this.onlyText = onlyText || false;
        this.className = className?.trim();
        this.content = content;
        this.tabIndex = tabIndex;
    }

    public get key(): number | string {
        let _temp = JSON.stringify(this);
        let hash = 0;
        for (var i = 0; i < _temp.length; i++) {
            var character = _temp.charCodeAt(i);
            hash = ((hash << 5) - hash) + character;
            hash = hash & hash; // в 32bit хы
        }
        return hash;
    }

}

class Flex extends Token {
    col: any;
    constructor(content: any, className: string, col: any) {
        super('div', content, true, false, `${style['flex-tr']}${className ? ` ${style[className.trim()] ?? className}` : ''}`);
        this.col = col;
        this.strict = false;
    }
}

interface Props {
    className?: string,
    value?: string,
    // WAI-ARIA
    role?: string
}

class _MarkdownContent extends React.Component<Props> {
    state: { srcValue: any, dom: any };
    constructor(props: any) {
        super(props);
        this.state = {
            srcValue: props.value,
            dom: this.parse(props.value)
        }
        this.parse = this.parse.bind(this);
        this.renderTree = this.renderTree.bind(this);
    }

    componentDidUpdate(prevProps: Props) {
        if (prevProps.value != this.props.value) {
            try {
                var dom = this.parse(this.props.value);
                this.renderTree(dom);
                this.setState(
                    {
                        srcValue: this.props.value,
                        dom: dom,
                    }
                )
            } catch (error) {
console.log(error);

            }
        }
    }

    primaryRecognize = (src: any) => {
        const header: RegExp = /^(?![ ]+)([#]{1,6})((:\(([\w\s]+)\)){0,1})([ ]{1})/i;
        const quote: RegExp = /^(?![ ]+)([>]{1})([ ]{1})/gi;
        const section: RegExp = /^((?![ ]+)(!===))|((===!))/gi;
        const hr: RegExp = /^(?![ ]+)(___)/gi;
        const code: RegExp = /^(?![ ]+)(```)/gi;
        const num: RegExp = /^(?![ ]+)((\*)|(\d\.))([ ]{1})/gi;
        const mark: RegExp = /^(?![ ]+)(-)([ ]{1})/gi;
        const subNum: RegExp = /^([ ]{0,3}((\*)|(\d\.)))([ ]{1})/gi;
        const subMark: RegExp = /^([ ]{0,3})(-)([ ]{1})/gi;
        const th: RegExp = /^(?![ ]+)(~\|)/gi;
        const tr: RegExp = /^(?![ ]+)(\|)(?!!)/gi;
        const trFlex: RegExp = /^(?![ ]+)(!\||\|!)/gi;
        const img: RegExp = /(?:^(?![ ]+)(?:!\())(.*?)(?:[)] ?)/i;
        const tdClass: RegExp = /^(?![ ]+)(\(([\s\w]+)\))\s/i;
        //сложный объект секция, может содержать внутри себя другие элементы
        //парный объект !===

        if (section.test(src)) {
            let addClass = src.replace(section, '').replace(/ /g, '');
            if (addClass === '')
                addClass = undefined;
            return new Token('section', undefined, true, false, style[addClass] ?? addClass);
        }

        if (code.test(src)) {
            let addClass = src.replace(code, '').replace(/ /g, '');
            let token = new Token('code', undefined, true, true, style[addClass] ?? addClass);
            token.strict = false;
            return token;
        }
        //Линия, HR
        if (hr.test(src))
            return new Element('hr');
        //Блок примитивов
        //заголовки
        if (src != null && header.test(src)) {
            let length = src.match(header)[1].length;
            let className = src.match(header)[4];
            return new Token(`h${length}`, src.replace(header, ''), false, true, style[className] ?? className, 500);
        }
        //цитаты
        if (quote.test(src)) {
            return new Token(`blockquote`, src.replace(quote, ''), false, true, style['quote']);
        }
        //нумированный список
        if (subNum.test(src)) {
            return new Token('ol', src.replace(num, ''));
        }
        //маркированный список
        if (subMark.test(src)) {
            return new Token('ul', src.replace(mark, ''));
        }
        //картинки
        if (img.test(src)) {
            let res = src.match(img)[1].split(':').filter((x: any) => x !== '');
            return new Token('img', res[0], false, true, res[1]);
        }

        //заголовок таблицы
        if (th.test(src)) {
            let _th = src.replace(th, '').split('|').filter((x: any) => x !== '');
            return new Token('thead', _th.map((x: any) => new Token('th', x)));
        };

        //строки таблицы
        if (tr.test(src)) {
            let col = src.replace(tr, '').split('|').filter((x: any) => x !== '');
            return new Token('tr',
                col.map((x: any) => {
                    let addClass = ((x || '').match(tdClass) || '')[2];
                    return new Token('td', x.replace(tdClass, ''), false, false, `${style['td'] ?? ''} ${addClass ?? ''}`);
                }),
                false, false, 'tr')
        }

        //строки таблицы
        if (trFlex.test(src)) {
            let addClass = src.replace(trFlex, '').replace(/( )|(:\d)/g, '');
            let col = src.replace(trFlex, '').split(':')[1];
            if (addClass === '')
                addClass = undefined;
            return new Flex(undefined, addClass, col);
        }

        if (src === '')
            return new Element('br');

        return new Token('span', src, false, false, style['text']);
    }

    //первичный грубый разбор
    primaryParse(src: any): any {
        let arr = (src || '').split('\n');
        let tokens = [];
        let element: any;

        for (let i = 0; i < arr.length; i++) {
            if (element && element.component) {
                let temp: any = this.primaryRecognize(arr[i]);
                if ((element.className === temp.className
                    || !temp.className
                    || !temp.strict
                    || element.className?.indexOf(temp.className) === 0)
                    && element.element === temp.element) {
                    if (element.content && !element.onlyText)
                        element.content = this.primaryParse(element.content);
                    tokens.push(element);
                    element = undefined;
                }
                else {
                    let content = (element.content || '');
                    element.content = `${content.length === 0 ? content : content + '\n'}${arr[i]}`;
                }
                continue;
            }
            if (element) {
                tokens.push(element);
                element = undefined;
            }

            element = this.primaryRecognize(arr[i]);
            if (!element.component) {
                tokens.push(element);
                element = undefined;
            }

        }
        return tokens.length === 0 ? src : tokens;
    }

    //обдумать
    secondaryRecognize = (src: any, p: number | undefined = undefined) => {
        if (!src || src.length <= 1)
            return src;
        let tempTokens = [];
        let content = '';
        for (let i = p || 0; i < src.length; i++) {
            let j = i + 1;
            let br = false;
            let token: any;

            //перевод на новую строку
            if (`${src[i]}${src[i + 1]}` === '!#' && !br) {
                br = true;
                token = new Token('br');
            }

            if (!br && !/([~]{2})([\w\W]+)([~]{2})|([_])([\w\W]+)([_])|([*])([\w\W]+)([*])|([*]{2})([\w\W]+)([*]{2})|([_]{2})([\w\W]+)([_]{2})|([`]{1})([\w\W]+)([`]{1})|(!#)|(!\([\w/.]+\))|(!:[\w а-яА-Я"#/.:_-]+:!)|(!inst\([\w а-яА-Я0-9#/.:_-]+\))|(!maps\(https:\/\/www.google.com[\wa-z!0-9#/%.:_=?-\\]+\))|(((!?)\[([а-яa-z.*0-9, ?!]+)?\])(\([a-zа-я#a/.:_\-?!&= ]+\)))/i.test(src))
                break;

            //Instagram
            if (!br && src.substring(i, 6) === '!inst(') {

                while (j < src.length) {
                    j++;
                    if (`${src[j]}` === ')') {
                        br = true;
                        token = new Token('inst', src.substring(i + 6, j), false, false);
                        break;
                    }
                }
            }

            //Maps
            if (!br && src.substring(i, 6) === '!maps(') {

                while (j < src.length) {
                    j++;
                    if (`${src[j]}` === ')') {
                        br = true;
                        token = new Token('maps', src.substring(i + 6, j), false, false);
                        break;
                    }
                }
            }

            //блок кода
            if (!br && src[i] === '`') {
                while (j < src.length) {
                    if (src[j++] === '`') {
                        br = true;
                        token = new Token('code', src.substring(i + 1, j - 1), false, true, style['inline-code']);
                        break;
                    }
                }
            }
            //жир
            if (!br && ['__', '**'].indexOf(`${src[i]}${src[i + 1]}`) >= 0) {
                while (j < src.length) {
                    j++;
                    if (['__', '**'].indexOf(`${src[j]}${src[j + 1]}`) >= 0) {
                        br = true;
                        token = new Token('b', src.substring(i + 2, j));
                        j++;
                        break;
                    }
                }
            }
            //зачёркнутый
            if (!br && `${src[i]}${src[i + 1]}` === '~~') {
                while (j < src.length) {
                    j++;
                    if (`${src[j]}${src[j + 1]}` === '~~') {
                        br = true;
                        token = new Token('s', src.substring(i + 2, j));
                        j++;
                        break;
                    }
                }
            }

            //курсив
            if (!br && ['_', '*'].indexOf(src[i]) >= 0) {
                while (j < src.length) {
                    j++;
                    if (['__', '**'].indexOf(`${src[j]}${src[j + 1]}`) >= 0)
                        j += 2;
                    if (['_', '*'].indexOf(src[j]) >= 0) {
                        br = true;
                        token = new Token('i', src.substring(i + 1, j));
                        break;
                    }
                }
            }

            //картинка
            if (!br && (
                (src[i] === '!' && src[i + 1] === '(') ||
                src.substring(i, i + 4) === '![](')) {
                let start = i;
                while (src[start] !== '(')
                    start++;
                while (j < src.length) {
                    j++;
                    if (`${src[j]}` === ')') {
                        br = true;
                        let imgContent = src.substring(start + 1, j).split(':').filter((x: string) => x !== '');
                        token = new Token('img', imgContent[0], false, false, imgContent[1]);
                        break;
                    }
                }
            }

            //ссылка
            if (!br && src[i] === '[') {
                let contentEnd = i;
                while (src[contentEnd] !== ']' && src[contentEnd])
                    contentEnd++;
                let text = src.substring(i + 1, contentEnd)
                let linkEnd = ++contentEnd;
                if (src[linkEnd] === '(') {
                    while (src[linkEnd] !== ')' && src[linkEnd])
                        linkEnd++;

                    token = new Token('a', text);
                    token.uri = src.substring(contentEnd + 1, linkEnd);
                    token.onlyText = true;
                    if (src[contentEnd]) {
                        j = linkEnd;
                        br = true;
                    }
                }
            }

            //ссылка
            if (!br && src[i] === '!' && src[i + 1] === ':') {
                while (j < src.length) {
                    j++;
                    if (src[j] === ':' && src[j + 1] === '!') {
                        br = true;
                        let linkContent = src.substring(i + 2, j).split(/:(?!\/\/)/i).filter((x: string) => x !== '');
                        if (linkContent.length > 1)
                            token = new Token('a', linkContent[1]);
                        else
                            token = new Token('a', linkContent[0]);
                        token.uri = linkContent[0];
                        if (linkContent[1]?.[0] === '#')
                            token.onlyText = true;
                        break;
                    }
                }
                j++;
            }

            if (br) {
                if (content && content !== '') {
                    tempTokens.push(new Token('span', content, false, false, style['text']));
                    content = '';
                }
                if (/([~]{2})([\w\W]+)([~]{2})|([_])([\w\W]+)([_])|([*])([\w\W]+)([*])|([*]{2})([\w\W]+)([*]{2})|([_]{2})([\w\W]+)([_]{2})|([`]{2})([\w\W]+)([`]{2})/i.test(token.content) && !token.onlyText)
                    token.content = this.secondaryRecognize(token.content);
                if (token) {
                    tempTokens.push(token);
                    token = undefined;
                    content = '';
                }
                i = j;
                continue;
            } else
                content += src[i];
        }
        if (content && content !== '') {
            tempTokens.push(new Token('span', content, false, false, style['text']));
        }
        if (tempTokens.length === 0)
            return src;
        if (tempTokens.length === 1)
            return tempTokens[0];
        return tempTokens;
    }

    //вторичный и более детальный разбор, + объединение листьев
    secondaryParse = (element: any) => {
        if (!element || element.onlyText)
            return element;
        let result: any = element;
        //console.info(element);

        if (typeof (element) == typeof ('')) {//string
            return this.secondaryRecognize(element);
        }

        if (element instanceof Array) {//array
            for (let i = 0; i < element.length; i++) {
                if (element[i].content)
                    element[i].content = this.secondaryParse(result[i].content);
            }
        }
        if (typeof (element) == typeof ({})) {//object
            if (!element.onlyText && element.content)
                result.content = this.secondaryParse(result.content);
        }
        return result;//заглушка
    }

    smile = memoize((text: any) => {
        if (typeof (text) != typeof (''))
            return text;
        const smile = [
            { reg: /:\)/, sm: '😊' }, { reg: /:\(/, sm: '☹' }, { reg: /:D/, sm: '😁' }, { reg: /:8/, sm: '😎' }
        ];
        for (let i = 0; i < smile.length; i++)
            text = text.replace(smile[i].reg, smile[i].sm);
        return text;
    }, (it, ...arg) => {
        return it;
    })

    normalizeVirtDom(element: any): any {
        if (!element || typeof (element) == typeof ('') || element.onlyText)
            return element;

        if (typeof (element) == typeof ({})) {//object
            if (!element.onlyText && element.content && element.content instanceof Array)
                element.content = this.normalizeVirtDom(element.content);
        }

        if (element instanceof Array) {//array
            let temp = [];
            for (let i = 0; i < element.length; i++) {

                //нормализация flex таблиц, надо подумать механизм управления
                if (element[i].className && element[i].className.indexOf(style['flex-tr']) === 0) {
                    let add = function (colContents: any, cols: Token[], length: number) {
                        if (colContents.length > 0) {
                            if (colContents.length > 1)
                                cols.push(new Token('div', colContents, true, false, style[`col${length ? `-${length}` : ''}`]));
                            else
                                cols.push(new Token('div', colContents[0], false, false, style[`col${length ? `-${length}` : ''}`]));
                        }
                    }
                    let colContent = [];
                    let col: any[] = [];
                    let el = element[i].content;
                    for (let co = 0; co < el.length; co++) {
                        if (el[co].element !== 'tr') {
                            colContent.push(el[co]);
                        } else {
                            add(colContent, col, element[i].col);
                            colContent = [];
                        }
                    }
                    add(colContent, col, element[i].col);

                    element[i].content = col;
                }

                if (element[i].component && !element[i].onlyText) {
                    temp.push(this.normalizeVirtDom(element[i]));
                    continue;
                }
                //нормализация нод списков
                if (element[i].element === 'ol' || element[i].element === 'ul') {
                    const content = element[i].content;
                    const tempInd = temp.length - 1;
                    if (temp[tempInd] && temp[tempInd].element === element[i].element) {
                        temp[tempInd].content = ((temp[tempInd].content instanceof Array) ?
                            temp[tempInd].content : [temp[tempInd].content])
                            .concat(new Token('li', content));
                    } else
                        temp.push(new Token(element[i].element, new Token('li', content)));
                    continue;
                }

                //нормализация дерева с таблицами, объединение нод итд
                if (element[i].element === 'tr' || element[i].element === 'thead') {
                    const thead = [];
                    const tbody = [];
                    const content = [];
                    while (i < element.length && element[i].element === 'thead') {
                        thead.push(new Token('tr', element[i].content));
                        i++;
                    }
                    while (i < element.length && element[i].element === 'tr') {
                        tbody.push(element[i]);
                        i++;
                    }
                    i--;
                    if (thead.length > 0)
                        content.push(new Token('thead', thead.length === 1 ? thead[0] : thead, thead.length > 1));
                    if (tbody.length > 0)
                        content.push(new Token('tbody', tbody.length === 1 ? tbody[0] : tbody, tbody.length > 1));
                    temp.push(new Token('table', content.length === 1 ? content[0] : content, content.length > 1));
                    continue;
                }

                if (element[i].className === style['quote'] && element[i].element === 'div' || element[i].element === 'span') {
                    let quote = [];
                    let el = element[i];
                    while (i < element.length && (element[i].className === el.className && element[i].element === el.element || element[i].element === 'br')) {
                        if (element[i].element === 'br') {
                            quote.push(element[i]);
                        }
                        else {
                            quote.push(element[i].content);
                            if (quote.length > 0 && quote[quote.length - 1].element !== 'br')
                                quote.push(new Element('br'));
                        }
                        i++;
                    }
                    if (el.className === style['quote'])
                        quote.pop();//удаляем лишний br
                    i--;
                    temp.push(new Token(el.element, quote, el.component, el.onlyText, el.className));
                    if (el.className === style['quote'])
                        temp.push(new Element('br'));
                    continue;
                }
                temp.push(element[i]);
            }
            return temp;
        }
        return element;//заглушка
    }

    parse(src: any): any {
        let primaryResult = this.primaryParse(src);
        return this.normalizeVirtDom(this.secondaryParse(primaryResult));
    }

    renderTree(dom: any): any {
        if (dom instanceof Array)
            return dom.map(x => this.renderTree(x));

        if (typeof (dom) == typeof ({})) {//object
            if (!dom.content)
                return <dom.element key={dom.key} className={dom.className} />;

            if (dom.content instanceof Array)
                return <dom.element key={dom.key} className={dom.className}>{dom.content.map((x: any) => this.renderTree(x))}</dom.element>;

            if (typeof (dom.content) === typeof ('')) {
                switch (dom.element) {
                    case 'img':
                        return <img key={dom.key} src={dom.content} className={dom.className} />
                    case 'code':
                        return <code key={dom.key} className={dom.className}>{dom.content}</code>
                    case 'a':
                        return <ReactLink key={dom.key} className={dom.className} to={dom.uri}>{dom.content}</ReactLink>
                    case 'inst':
                        return <Instagram
                            pkey={dom.key}
                            key={dom.key}
                            url={dom.content}
                            className={dom.className}
                        />
                    case 'maps':
                        return <GMaps
                            pkey={dom.key}
                            key={dom.key}
                            url={dom.content}
                        />
                    default:
                        return <dom.element tabIndex={dom.tabIndex} key={dom.key} className={dom.className}>{this.smile(dom.content || '')}</dom.element>;
                }
            }
            if (typeof (dom) == typeof ({}))
                return <dom.element key={dom.key} className={dom.className}>{this.renderTree(dom.content)}</dom.element>;
        }
        if (typeof (dom) == typeof (''))
            return this.smile(dom);
        return undefined;
    }

    render() {
        let content;
        if (!this.state.dom)
            content = '';
        if (typeof (this.state.dom) == typeof ('')) {//string
            content = <span className='text'>{this.state.dom}</span>;
        } else {
            content = this.renderTree(this.state.dom) || <pre>{JSON.stringify(this.state.dom, null, "\t")}</pre>;
        }
        return <div
            role={this.props.role}
            className={`${this.props.className} ${style['markdown-wrapper']}`}
        >
            {
                content
            }
        </div>;
    }
}

const MarkdownContent = React.memo(_MarkdownContent, (prev, next): boolean => prev.value === next.value);
export default MarkdownContent;