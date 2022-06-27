<%@ WebHandler Language="C#" Class="UploadFiles" %>

using System;
using System.IO;
using System.Security.AccessControl;
using System.Security.Principal;
using System.Web;

public class UploadFiles : IHttpHandler
{
    public void ProcessRequest(HttpContext context)
    {
        try
        {
            string targetFolder = HttpContext.Current.Server.MapPath("../uploaded-files");

            if (!Directory.Exists(targetFolder))
            {
                Directory.CreateDirectory(targetFolder);
                var info = new DirectoryInfo(targetFolder);
                var self = WindowsIdentity.GetCurrent();
                var ds = info.GetAccessControl();
                ds.AddAccessRule(new FileSystemAccessRule(self.Name, FileSystemRights.FullControl, InheritanceFlags.ObjectInherit | InheritanceFlags.ContainerInherit, PropagationFlags.None, AccessControlType.Allow));
                info.SetAccessControl(ds);
            }
            var result = "0";
			try
			{
				if (context.Request.Files.Count > 0)
				{
					HttpPostedFile file = null;

					for (int i = 0; i < context.Request.Files.Count; i++)
					{
						file = context.Request.Files[i];
						if (file.ContentLength > 0)
						{
							var fileName = Path.GetFileName(file.FileName);
							var path = Path.Combine(targetFolder, fileName);
							file.SaveAs(path);
							result = "1"; 
						}
					}    

				}
				context.Response.Write(result);
			}
			catch (Exception exception)
			{
				context.Response.Write(result);
			}
        }
        catch (Exception exception)
        {
            context.Response.Write(exception);
        }
    }

    public bool IsReusable
    {
        get { return false; }
    }
}