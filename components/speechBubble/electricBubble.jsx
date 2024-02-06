import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function ElectricBubble({ text }) {
    return (
        <div className="flex justify-start pl-4 items-center w-fit min-w-36 max-w-[300px] font-[SequentialistBB] text-sm text-center box-content bg-[url(/electric-bubble.svg)]">
            <div className='mt-6 px-3 mb-20'>
                <Markdown remarkPlugins={[remarkGfm]}>{text}</Markdown>
            </div>
        </div>
    )
}