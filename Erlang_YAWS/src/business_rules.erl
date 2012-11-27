%%
%% Copyright 2007 Lee S. Barney
		
 %% Permission is hereby granted, free of charge, to any person obtaining a 
 %% copy of this software and associated documentation files (the "Software"), 
 %% to deal in the Software without restriction, including without limitation the 
 %% rights to use, copy, modify, merge, publish, distribute, sublicense, 
 %% and/or sell copies of the Software, and to permit persons to whom the Software 
 %% is furnished to do so, subject to the following conditions:
 
 %% The above copyright notice and this permission notice shall be 
 %% included in all copies or substantial portions of the Software.
 
 
 %% THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
 %% INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A 
 %% PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT 
 %% HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF 
 %% CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE 
 %% OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
-module(businessrules).


%%
%% Include files
%%
-include_lib("stdlib/include/qlc.hrl").
-record(qc_user, {id, uname, pword}).

%%
%% Exported Functions
%%
-export([get_default_b_rule/1, login_b_rule/1, get_user_count_b_rule/1]).

%%
%% API Functions
%%

%%
%% TODO: Add description of get_default_b_rule/function_arity
%%
get_default_b_rule(_Request) -> 
    ok.%change this so if the request contains the ajax key ajax is returned.

%%
% This function evaluates the user name and password returning true if 
% a match is found and false if it is not.
%%
login_b_rule(_Request) -> 
    %%
    %get the user name and password from the query
    %%
    {value,{_,Uname}} = lists:keysearch("uname",1,yaws_api:parse_post(_Request)),
    {value,{_,Pword}} = lists:keysearch("pword",1,yaws_api:parse_post(_Request)),
    Query = qlc:q([X#qc_user.id || X <- mnesia:table(qc_user)
                     ,X#qc_user.uname == Uname
                     ,X#qc_user.pword == Pword
                     ]),
    Results = mnesia_data_access:get_data(Query),
    
    NumFound = lists:flat_length(Results),
    if
    NumFound == 1 -> [Id|[]] = Results,
                     Found = Id;
    true -> Found = false
    end,
    
    Found.
get_user_count_b_rule(_Request) ->
    Query = qlc:q([X || X <- mnesia:table(qc_user)]),
    Results = mnesia_data_access:get_data(Query),
    lists:flat_length(Results).

%%
%% Local Functions
%%

