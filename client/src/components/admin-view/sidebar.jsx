import { ChartNoAxesCombined } from "lucide-react";
import React, { Fragment } from "react";
import { useNavigate } from "react-router-dom";

const AdminSideBar = () => {
  const navigate = useNavigate();
  return (
    <Fragment>
      <aside className="hidden w-64 flex-col border-r bg-background p-6 lg:flex">
        <div
          onClick={() => navigate("/admin/dashboard")}
          className="flex cursor-pointer items-center gap-2"
        >
          <ChartNoAxesCombined size={30} />
          <h3 className="text-xl font-extrabold">Admin panel</h3>
        </div>
      </aside>
    </Fragment>
  );
};

export default AdminSideBar;
