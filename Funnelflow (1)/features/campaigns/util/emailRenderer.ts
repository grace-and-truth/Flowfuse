import { EmailBlock, Campaign, FormField } from '../../../types';

const getVmlShapePath = (type: EmailBlock['props']['shapeType'], w: number, h: number): string => {
     switch (type) {
        case 'triangle-up':
            return `m ${w / 2},0 l ${w},${h} l 0,${h} x e`;
        case 'triangle-down':
            return `m 0,0 l ${w},0 l ${w/2},${h} x e`;
        case 'star':
             const r = w / 2;
             const ir = r / 2;
             let path = 'm ';
             for (let i = 0; i < 10; i++) {
                const radius = i % 2 === 0 ? r : ir;
                const angle = i * 36;
                path += `${Math.round(r + radius * Math.cos(angle * Math.PI / 180 - Math.PI / 2))},${Math.round(r + radius * Math.sin(angle * Math.PI / 180 - Math.PI / 2))} l `;
             }
             return path.slice(0, -3) + ' x e';
        default: // rectangle & circle (circle handled by element type)
            return `m 0,0 l ${w},0 l ${w},${h} l 0,${h} x e`;
    }
}

const renderBlockToHtml = (block: EmailBlock): string => {
    const props = block.props;
    const textAlign = props.textAlign || 'left';
    
    switch (block.type) {
        case 'header':
            return `
                <tr>
                    <td style="padding: ${props.paddingY || 16}px ${props.paddingX || 24}px; text-align: ${textAlign};">
                        <img src="${props.logoSrc || ''}" alt="${props.logoAlt || ''}" style="display: inline-block; max-width: 100%; height: auto; border: 0;" />
                    </td>
                </tr>`;
        case 'text':
            return `
                <tr>
                    <td style="padding: ${props.paddingY || 0}px ${props.paddingX || 24}px; text-align: ${textAlign}; font-family: ${props.fontFamily || 'Arial, sans-serif'}; color: #334155; line-height: 1.5;">
                        ${props.content || ''}
                    </td>
                </tr>`;
        case 'image':
            const imageTag = `<img src="${props.src || ''}" alt="${props.alt || ''}" style="display: block; width: 100%; height: auto; border: 0;" />`;
            const link = props.href;
            const imageHtml = link ? `<a href="${link}" target="_blank" style="text-decoration: none; border: 0;">${imageTag}</a>` : imageTag;
            return `
                <tr>
                    <td style="padding: 0;">
                        ${imageHtml}
                    </td>
                </tr>`;
        case 'button':
            return `
                <tr>
                    <td style="padding: 16px 24px; text-align: ${textAlign};">
                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="display: inline-block;">
                            <tr>
                                <td style="background-color: ${props.backgroundColor || '#0ea5e9'}; border-radius: 6px;">
                                    <a href="${props.href || '#'}" target="_blank" style="display: inline-block; color: ${props.textColor || '#ffffff'}; font-family: sans-serif; font-size: 16px; font-weight: bold; text-decoration: none; padding: 12px 24px; border-radius: 6px;">
                                        ${props.text || 'Button Text'}
                                    </a>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>`;
        case 'divider':
            return `
                <tr>
                    <td style="padding: ${props.paddingY || 10}px ${props.paddingX || 24}px;">
                        <div style="border-top: 1px solid ${props.color || '#cbd5e1'};"></div>
                    </td>
                </tr>`;
        case 'spacer':
            const height = props.height || 20;
            return `
                <tr>
                    <td style="height: ${height}px; line-height: ${height}px; font-size: ${height}px;">&nbsp;</td>
                </tr>`;
         case 'shape': {
            const { 
                shapeType = 'rectangle', backgroundColor = '#e2e8f0', 
                width = 100, height = 50, rotation = 0,
                shapeText, shapeTextColor, shapeFontSize, fontFamily
            } = props;
            const isCircle = shapeType === 'circle';
            const isStar = shapeType === 'star';
            const size = isCircle || isStar ? Math.max(width, height) : width;
            const vmlWidth = isCircle || isStar ? size : width;
            const vmlHeight = isCircle || isStar ? size : height;

            const vmlShapeType = isCircle ? 'oval' : 'shape';
            const vmlPath = isCircle ? '' : `path="${getVmlShapePath(shapeType, vmlWidth, vmlHeight)}"`;
            
            const vmlContent = shapeText ? `
                <v:textbox style="mso-fit-shape-to-text:true" inset="0,0,0,0">
                    <div style="text-align:center;">
                        <p style="font-family:${fontFamily}; font-size:${shapeFontSize}px; color:${shapeTextColor}; margin:0;">${shapeText}</p>
                    </div>
                </v:textbox>` : '';

            return `
                <tr>
                    <td align="center" style="padding: 30px 24px;">
                        <!--[if mso]>
                        <v:${vmlShapeType} fill="true" stroke="false" fillcolor="${backgroundColor}" style="width:${vmlWidth}pt;height:${vmlHeight}pt;rotation:${rotation};">
                            ${vmlPath}
                            ${vmlContent}
                        </v:${vmlShapeType}>
                        <![endif]-->
                        <!--[if !mso]><!-->
                        <div style="position:relative; width:${vmlWidth}px; height:${vmlHeight}px; margin: 0 auto; transform: rotate(${rotation}deg);">
                             <svg viewBox="0 0 ${vmlWidth} ${vmlHeight}" width="100%" height="100%" style="position: absolute; top: 0; left: 0;">
                                <path d="${getVmlShapePath(shapeType, vmlWidth, vmlHeight).replace(/m |l |x e/g, (m) => ({'m ':'M','l ':'L ','x e':'Z'})[m] || '')}" fill="${backgroundColor}" />
                            </svg>
                            ${shapeText ? `
                            <div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); width:90%; text-align:center; color:${shapeTextColor}; font-size:${shapeFontSize}px; font-family:${fontFamily};">
                                ${shapeText}
                            </div>
                            ` : ''}
                        </div>
                        <!--<![endif]-->
                    </td>
                </tr>
            `;
        }
        case 'form': {
            const { 
                formStyle = 'simple',
                formFields = [],
                submitButtonText = 'Submit',
                formActionType = 'showMessage',
                formActionData = {},
                paddingX = 24,
                paddingY = 24
            } = props;
            
            const renderField = (field: FormField) => {
                const requiredAttr = field.required ? 'required' : '';
                const labelStyle = `display: block; font-family: sans-serif; font-size: 14px; font-weight: bold; color: #334155; margin-bottom: 4px;`;
                const inputBaseStyle = `width: 100%; box-sizing: border-box; font-family: sans-serif; font-size: 14px;`;

                let inputStyle = '';
                if (formStyle === 'simple') {
                    inputStyle = `padding: 10px; border: 1px solid #cbd5e1; border-radius: 4px;`;
                } else if (formStyle === 'modern') {
                    inputStyle = `padding: 12px 0; border: none; border-bottom: 2px solid #94a3b8; background-color: transparent;`;
                }

                if (field.type === 'checkbox') {
                    return `<div style="margin-bottom: 12px; display: table;">
                        <input type="checkbox" id="${field.id}" name="${field.label}" ${requiredAttr} style="margin-right: 8px; vertical-align: middle;">
                        <label for="${field.id}" style="display: table-cell; vertical-align: middle; font-family: sans-serif; font-size: 14px; color: #334155;">${field.label}</label>
                    </div>`;
                }
                
                return `
                    <div style="margin-bottom: 12px;">
                        <label for="${field.id}" style="${labelStyle}">${field.label}</label>
                        ${field.type === 'textarea'
                            ? `<textarea id="${field.id}" name="${field.label}" placeholder="${field.placeholder || ''}" ${requiredAttr} rows="4" style="${inputBaseStyle} ${inputStyle}"></textarea>`
                            : `<input type="${field.type}" id="${field.id}" name="${field.label}" placeholder="${field.placeholder || ''}" ${requiredAttr} style="${inputBaseStyle} ${inputStyle}">`
                        }
                    </div>
                `;
            };

            const fieldsHtml = (props.formFields || []).map(renderField).join('');
            
            let hiddenInputs = '';
            if (formActionType !== 'showMessage') {
                hiddenInputs += `<input type="hidden" name="_funnelAction" value="${formActionType}">`;
                if (formActionType === 'redirect' && formActionData.redirectUrl) {
                    hiddenInputs += `<input type="hidden" name="_redirectUrl" value="${formActionData.redirectUrl}">`;
                }
                if (formActionType === 'addTags' && formActionData.tags) {
                    hiddenInputs += `<input type="hidden" name="_tagsToAdd" value="${formActionData.tags}">`;
                }
            }

            return `
                <tr>
                    <td style="padding: ${paddingY}px ${paddingX}px;">
                        <form action="#" method="POST" target="_blank">
                            ${hiddenInputs}
                            ${fieldsHtml}
                            <div style="margin-top: 20px;">
                                <input type="submit" value="${submitButtonText}" style="width: 100%; padding: 12px; background-color: #0ea5e9; color: #ffffff; border: none; border-radius: 6px; font-size: 16px; font-weight: bold; cursor: pointer;">
                            </div>
                        </form>
                    </td>
                </tr>
            `;
        }
        default:
            return '';
    }
}


export const renderEmailHtml = (blocks: EmailBlock[], subject: string, style: Campaign['style']): string => {
    const bodyBackgroundColor = style?.bodyBackgroundColor || '#f1f5f9';
    const contentBackgroundColor = style?.contentBackgroundColor || '#ffffff';
    const bodyContent = blocks.map(renderBlockToHtml).join('');

    return `
    <!DOCTYPE html>
    <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="x-apple-disable-message-reformatting">
        <title>${subject}</title>
        <!--[if mso]>
        <style>
            * { font-family: sans-serif !important; }
        </style>
        <o:OfficeDocumentSettings>
            <o:AllowPNG/>
            <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
        <![endif]-->
        <style>
            body { margin: 0; padding: 0; word-spacing: normal; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
            table, td, th { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
            img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
            p { display: block; margin: 13px 0; }
        </style>
    </head>
    <body style="background-color: ${bodyBackgroundColor}; margin: 0; padding: 0;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
            <tbody>
                <tr>
                    <td style="padding: 20px 0;">
                        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="max-width:600px; width:100%; margin: 0 auto; background-color: ${contentBackgroundColor};">
                            <tbody>
                                ${bodyContent}
                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>
    </body>
    </html>
    `;
}