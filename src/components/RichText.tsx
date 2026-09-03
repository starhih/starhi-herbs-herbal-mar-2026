import React from 'react'

export const RichText: React.FC<{ content: any }> = ({ content }) => {
    if (!content || !content.root || !content.root.children) return null

    return (
        <div className="rich-text">
            {content.root.children.map((node: any, i: number) => {
                if (node.type === 'paragraph') {
                    return (
                        <p key={i} style={{ marginBottom: '1rem' }}>
                            {node.children?.map((child: any, j: number) => {
                                if (child.type === 'text') {
                                    const text = child.text
                                    if (child.format & 1) return <strong key={j}>{text}</strong>
                                    if (child.format & 2) return <em key={j}>{text}</em>
                                    return <span key={j}>{text}</span>
                                }
                                return null
                            })}
                        </p>
                    )
                }
                if (node.type === 'heading') {
                    const Tag = node.tag as any
                    return (
                        <Tag key={i} style={{ marginTop: '2rem', marginBottom: '1rem' }}>
                            {node.children?.map((child: any, j: number) => child.text)}
                        </Tag>
                    )
                }
                if (node.type === 'list') {
                    const Tag = node.listType === 'bullet' ? 'ul' : 'ol'
                    return (
                        <Tag key={i} style={{ marginBottom: '1.5rem', paddingLeft: '1.5rem' }}>
                            {node.children?.map((item: any, j: number) => (
                                <li key={j} style={{ marginBottom: '0.5rem' }}>
                                    {item.children?.map((child: any, k: number) => child.text)}
                                </li>
                            ))}
                        </Tag>
                    )
                }
                return null
            })}
        </div>
    )
}
