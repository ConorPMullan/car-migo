import { Alert, Snackbar } from '@mui/material';

export default function AlertPopUp(props: any) {
  return (
    <Snackbar open={props.open} autoHideDuration={3000} onClose={props.onClose}>
      <Alert
        onClose={props.onClose}
        severity={props.severity}
        sx={{ width: '100' }}
      >
        {props.message}
      </Alert>
    </Snackbar>
  );
}
