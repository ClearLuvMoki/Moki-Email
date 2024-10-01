import {memo} from 'react';
import deepEqual from "deep-equal";
// import Markdown from 'react-markdown'
// import rehypeRaw from "rehype-raw";
// import remarkGfm from 'remark-gfm'
// import { Html, Button } from "@react-email/components";


interface Props {
    content:string;
}

const MailView = memo(({content}: Props) => {
    return (
        <div className="w-full h-full">
            <iframe srcDoc={content} className="w-full h-full border-none"/>
            {/*<Markdown rehypePlugins={[rehypeRaw, remarkGfm]}>{content}</Markdown>*/}
        </div>
    );
}, (prevProps, nextProps) => {
    return deepEqual(prevProps, nextProps, {strict: true})
});

export default MailView;
