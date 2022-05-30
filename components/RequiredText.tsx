import { Text } from '@nextui-org/react';

export default function RequiredTextError() {
    return (
        <Text color="error" size={12}>
            Este es un campo obligatorio.
        </Text>
    );
}
