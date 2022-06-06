export const METHOD_NOT_ALLOWED_ERROR = { error: 'Method not allawed' };
export const NOT_FOUND_ERROR = { error: 'Not Found' };

export const HTTP_CODES = {
    METHOD_NOT_ALLOWED: 405,
    NOT_FOUND: 404,
    CREATED: 201,
    OK: 200,
    SERVER_ERROR: 500,
    UPDATED: 204,
};

export const ERROR_MESSAGE = 'Ocurrió un error, intenta de nuevo';

export const VARIANTS = [
    {
        id: 'variant',
        options: [
            {
                __typename: 'MultipleChoiceOption',
                id: 'multiple',
                displayName: 'Tamaño',
                values: [
                    {
                        label: '32x32',
                    },
                ],
            },
        ],
    },
];

export const OPTIONS = [
    {
        id: 'option-color',
        displayName: 'Color',
        values: [
            {
                label: 'color',
                hexColors: ['#222'],
            },
        ],
    },
];

export enum GiroNegocio {
    EXTRACCION_MINERA = 1,
    MATERIA_PRIMA = 2,
    MAQUINARIA = 3,
    CONSTRUCCION = 4,
}
