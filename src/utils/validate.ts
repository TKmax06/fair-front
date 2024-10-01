/**
 * 验证是否为空或者空字符串
 */
export function isBlank(s: string) {
    return s == null || s.length == 0;
}


/**
 * 验证URL地址
 */
export function isURL(s: string) {
    return /^http[s]?:\/\/.*/.test(s);
}

/**
 * 验证用户名
 */
export function isUsername(s: string) {
    return /^[a-zA-Z0-9._%+-]+@celestica\.com$/.test(s);
}

/**
 * 验证密码
 */
export function isPassword(s: string) {
    return /^.{4,8}$/.test(s);
}
