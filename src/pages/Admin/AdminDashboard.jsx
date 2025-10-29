import React from "react";
import { Container, Box } from "@mui/material";
import UserTable from "../../components/UserTable/UserTable";

const AdminDashboard = () => (
  <>
    
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box>
        <UserTable/>
      </Box>
    </Container>
  </>
);

export default AdminDashboard;
