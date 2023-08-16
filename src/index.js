const defaultStyle = {
  background: '#4caf50',
  color: 'white',
  padding: '5px',
  'border-radius': '5px'
}

const customThemeStyle = {
  red: {
    background: '#f44336'
  },
  green: {
    background: '#4caf50'
  },
  blue: {
    background: '#2196f3'
  },
  pink: {
    background: '#ff69b4'
  }
}
let combineThemeStyle = {...customThemeStyle}

const isDevelopment = process.env.NODE_ENV === "development"

const generateStyle = (style) => {
  return Object.entries(style)
  .map(([key, value]) => `${key}: ${value}`)
  .join('; ')
}

const hasTrailingComments = (node) => {
  const trailingComments = node.trailingComments
  return trailingComments && (trailingComments.length > 0)
}

const isConsoleLog = (t, callee) => {
  return t.isMemberExpression(callee) &&
  t.isIdentifier(callee.object, { name: 'console' }) &&
  t.isIdentifier(callee.property, { name: 'log' })
}
const transformCustomConsoleStyle = ({ types: t }, { themeStyle }) => {
  if(themeStyle){
    combineThemeStyle = {...customThemeStyle, ...themeStyle}
  }
  return {
    visitor: {
      CallExpression(path) {
        const { callee, arguments: args } = path.node
        if (isConsoleLog(t, callee)) {
          const parentNode = path.parentPath.node
          if (hasTrailingComments(parentNode)) {
            const { start:{ line: currentLine } } = parentNode.loc
            parentNode.trailingComments.forEach((comment) => { 
              const { start:{ line: currentCommentLine } } = comment.loc
              if(currentLine === currentCommentLine){
                const commentValue = comment.value
                if(commentValue){
                  const [prefix, theme] =  commentValue.split('|')
                  let style = ''
                  if(theme && combineThemeStyle[theme]){
                    style = generateStyle({...defaultStyle, ...combineThemeStyle[theme]})
                  }else{
                    style = generateStyle(defaultStyle)
                  }
                  path.node.arguments = [t.stringLiteral('%c'+prefix), t.stringLiteral(style), ...args]
                }
              }
            })
            delete parentNode.trailingComments
          }
        }
      }
    }
  }
}

module.exports = transformCustomConsoleStyle