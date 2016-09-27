create or replace package alexa_orders
as
function how_many
	(p_query      in varchar2
	,p_first_name in varchar2
	,p_last_name  in varchar2
	,p_customer   in varchar2
	,p_date       in date
	)
return varchar2;


end alexa_orders;
/