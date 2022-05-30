import { Button, Loading, Modal, Text } from '@nextui-org/react';

export interface ConfirmationDialogProps {
    visible: boolean;
    title: string;
    body: string;
    closeHandler: () => void;
    confirmationHandler: () => void;
    loading?: boolean;
}

export default function ConfirmationDialog({
    visible,
    closeHandler,
    title,
    body,
    confirmationHandler,
    loading,
}: ConfirmationDialogProps) {
    return (
        <Modal closeButton blur aria-labelledby="modal-title" open={visible} onClose={closeHandler}>
            <Modal.Header>
                <Text id="modal-title" size={18}>
                    {title}
                </Text>
            </Modal.Header>
            <Modal.Body>{body}</Modal.Body>
            <Modal.Footer>
                <Button auto flat color="error" onClick={closeHandler}>
                    No
                </Button>
                <Button
                    auto
                    onClick={confirmationHandler}
                    iconRight={loading && <Loading type="points-opacity" color="currentColor" size="lg" />}
                >
                    Sí, Eliminar
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
