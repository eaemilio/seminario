export const slugify = (str: string) =>
    str
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');

export const notNull = <T>(value: T | null): value is T => value !== null;
export const isNull = <T>(value: T | null): value is T => !notNull(value);

export const notUndefined = <T>(value: T | undefined): value is T => value !== undefined;
export const isUndefined = <T>(value: T | null): value is T => !notUndefined(value);

export const notNil = <T>(value: T | null | undefined): value is T => notNull(value) && notUndefined(value);
export const isNil = <T>(value: T | null | undefined): value is T => isNull(value) || isUndefined(value);

export const getInitals = (name: string | null): string => {
    if (!name) {
        return '';
    }

    let rgx = new RegExp(/(\p{L}{1})\p{L}+/, 'gu');

    let initials = [...name.matchAll(rgx)] || [];

    return ((initials.shift()?.[1] || '') + (initials.pop()?.[1] || '')).toUpperCase();
};
