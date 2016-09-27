create or replace package body alexa_orders
as

function how_many
	(p_query      in varchar2
	,p_first_name in varchar2
	,p_last_name  in varchar2
	,p_customer   in varchar2
	,p_date       in date
	)
return varchar2
is
	l_cnt   pls_integer;
	l_speak varchar2(32767);
	l_noun  varchar2(10);
begin
	if p_query = 'NBR_OF_ORDERS_FOR_CUSTOMER' then
		l_noun := 'order';
		if p_customer is not null then

			select count(*) cnt 
			 into l_cnt
			 from demo_orders o 
			 join demo_customers c on c.customer_id = o.customer_id 
			where upper(c.cust_first_name) ||' '|| upper(c.cust_last_name)  = upper(p_customer);

			if l_cnt != 1 then
				l_noun := l_noun || 's';
			end if;

	  		l_speak := 'Customer '||p_customer||' placed '||l_cnt||' '||l_noun;			
		else

			select count(*) cnt 
			 into l_cnt
			 from demo_orders o 
			 join demo_customers c on c.customer_id = o.customer_id 
			where upper(c.cust_first_name) = upper(p_first_name)
			  and upper(c.cust_last_name)  = upper(p_last_name);

			if l_cnt != 1 then
				l_noun := l_noun || 's';
			end if;

	  		l_speak := 'Customer '||p_first_name||' '||p_last_name||' placed '||l_cnt||' '||l_noun;
		end if;

	end if;


	if p_query = 'NBR_OF_ITEMS_FOR_CUSTOMER' then
		l_noun := 'item';
		if p_customer is not null then

			select count(*) cnt
			  into l_cnt
			  from demo_customers  c
			  join demo_orders o on c.customer_id = o.customer_id
			  join demo_order_items i on o.order_id = i.order_id
			 where upper(c.cust_first_name) ||' '|| upper(c.cust_last_name)  = upper(p_customer);

			if l_cnt != 1 then
				l_noun := l_noun || 's';
			end if;

	  		l_speak := 'Customer '||p_first_name||' '||p_last_name||' ordered '||l_cnt||' '||l_noun;
		else

			select count(*) cnt
			  into l_cnt
			  from demo_customers  c
			  join demo_orders o on c.customer_id = o.customer_id
			  join demo_order_items i on o.order_id = i.order_id
			 where upper(c.cust_first_name) = upper(p_first_name)
			   and upper(c.cust_last_name)  = upper(p_last_name);


			if l_cnt != 1 then
				l_noun := l_noun || 's';
			end if;

	  		l_speak := 'Customer '||p_first_name||' '||p_last_name||' ordered '||l_cnt||' '||l_noun;
		end if;

	end if;

	return l_speak;
end how_many;

end alexa_orders;
/