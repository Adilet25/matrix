import AdminMatchPanel from "../../components/sections/admin/AdminMatchPanel";
import AdminTournamentPanel from "../../components/sections/admin/AdminTournamentPanel";

const AdminPage = () => {
  return (
    <div>
      <AdminTournamentPanel />
      <AdminMatchPanel />
    </div>
  );
};

export default AdminPage;
