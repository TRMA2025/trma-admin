import React, { useEffect, useState } from "react";
import { Container, Typography, Button, Table, TableBody, TableCell, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, IconButton, CircularProgress, Stack } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSnackbar } from "notistack";
import { listAdminUsers, addAdminUser, deleteAdminUser } from "../../DAL/AdminUsers/adminUsers";

export default function AdminUsers() {
  const { enqueueSnackbar } = useSnackbar();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "admin" });

  const load = async () => { setLoading(true); const r = await listAdminUsers(); if (r.code === 200) setRows(r.admin_users || []); else enqueueSnackbar(r.message, { variant: "error" }); setLoading(false); };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!form.name || !form.email || !form.password) { enqueueSnackbar("Name, email and password are required", { variant: "error" }); return; }
    setSaving(true);
    const r = await addAdminUser({ ...form, email: form.email.trim().toLowerCase() });
    setSaving(false);
    if (r.code === 200) { enqueueSnackbar("Admin user added", { variant: "success" }); setOpen(false); setForm({ name: "", email: "", password: "", role: "admin" }); load(); }
    else enqueueSnackbar(r.message || "Could not add user", { variant: "error" });
  };
  const remove = async (u) => {
    if (!window.confirm(`Remove ${u.name} (${u.email}) from admin?`)) return;
    const r = await deleteAdminUser(u._id);
    if (r.code === 200) { enqueueSnackbar("Removed", { variant: "success" }); load(); } else enqueueSnackbar(r.message, { variant: "error" });
  };

  return (
    <Container>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4">Admin Users</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>Add Admin User</Button>
      </Stack>
      <Paper>
        {loading ? <CircularProgress sx={{ m: 3 }} /> : (
          <Table>
            <TableHead><TableRow><TableCell>Name</TableCell><TableCell>Email</TableCell><TableCell>Role</TableCell><TableCell>Added</TableCell><TableCell align="right">Action</TableCell></TableRow></TableHead>
            <TableBody>
              {rows.map((u) => (
                <TableRow key={u._id}>
                  <TableCell>{u.name}</TableCell><TableCell>{u.email}</TableCell><TableCell>{u.role}</TableCell>
                  <TableCell>{u.createdAt ? new Date(u.createdAt).toLocaleDateString("en-GB") : ""}</TableCell>
                  <TableCell align="right"><IconButton onClick={() => remove(u)}><DeleteIcon /></IconButton></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Add Admin User</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} fullWidth />
            <TextField label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} fullWidth />
            <TextField label="Starting password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} fullWidth helperText="They can change it from their profile" />
            <TextField select label="Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} fullWidth>
              <MenuItem value="admin">Admin (full access)</MenuItem>
              <MenuItem value="manager">Manager</MenuItem>
              <MenuItem value="developer">Developer</MenuItem>
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={save} disabled={saving}>{saving ? "Saving…" : "Add"}</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
