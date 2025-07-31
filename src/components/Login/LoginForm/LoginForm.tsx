import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import { useLogin } from "@/hooks/Login/useLogin";

export function LoginForm() {
  const { formik, errorMsg, loading } = useLogin();

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 10 }}>
        <Box mt={0} textAlign="center">
          <Typography variant="h4" gutterBottom>
            Let's get started!
          </Typography>

          <form onSubmit={formik.handleSubmit} noValidate>
            <Box my={2}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                margin="normal"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                error={formik.touched.email && !!formik.errors.email}
              />
            </Box>

            <Box my={2}>
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                margin="normal"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                error={formik.touched.password && !!formik.errors.password}
              />
            </Box>

            {(formik.errors.email || formik.errors.password || errorMsg) && (
              <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
                {formik.errors.email || formik.errors.password || errorMsg}
              </Alert>
            )}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading || !(formik.isValid && formik.dirty)}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </Box>
      </Paper>
    </Container>
  );
}
