import re

with open('src/static/index.html', 'r', encoding='utf-8') as f:
    text = f.read()

scripts = list(re.finditer(r'<script.*?>([\s\S]*?)</script>', text))
script_text = scripts[5].group(1)
start_line = text[:scripts[5].start()].count('\n') + 1

in_s_quote = False
in_d_quote = False
in_t_quote = False
in_line_comment = False
in_block_comment = False

stack = []

for i, char in enumerate(script_text):
    current_line = start_line + script_text[:i].count('\n')
    
    if char == '\n':
        if in_line_comment:
            in_line_comment = False
        continue
        
    if in_line_comment:
        continue
    if in_block_comment:
        if char == '/' and script_text[i-1] == '*':
            in_block_comment = False
        continue
        
    if in_s_quote:
        if char == "'" and script_text[i-1] != '\\':
            in_s_quote = False
        continue
    if in_d_quote:
        if char == '"' and script_text[i-1] != '\\':
            in_d_quote = False
        continue
    if in_t_quote:
        if char == '`' and script_text[i-1] != '\\':
            in_t_quote = False
        continue
        
    if char == '/' and i+1 < len(script_text):
        if script_text[i+1] == '/':
            in_line_comment = True
            continue
        elif script_text[i+1] == '*':
            in_block_comment = True
            continue
            
    if char == "'":
        in_s_quote = True
    elif char == '"':
        in_d_quote = True
    elif char == '`':
        in_t_quote = True
    elif char == '{':
        stack.append(current_line)
    elif char == '}':
        if stack:
            stack.pop()
        else:
            print(f"Excess closing brace at line {current_line}")

print(f"Final stack of unclosed braces at lines: {stack}")
