// @ts-ignore
import Odoo from "odoo-xmlrpc"

const odoo = new Odoo({
  url: "https://your-odoo-domain.com", // Replace with your Odoo server URL
  port: 443,
  db: "your-odoo-db",                  // Replace with your Odoo database name
  username: "vigyatchemicals@gmail.com",
  password: "V!gy@t3628@C0",
})

export async function connectOdoo() {
  return new Promise((resolve, reject) => {
    odoo.connect((err: any) => {
      if (err) {
        reject(err)
      } else {
        resolve(odoo)
      }
    })
  })
}