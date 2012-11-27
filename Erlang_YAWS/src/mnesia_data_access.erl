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
-module(mnesia_data_access).


%%
%% Include files
%%

%%
%% Exported Functions
%%
-export([get_data/1, set_data/1]).

%%
%% API Functions
%%

%%
%% Facade pattern applied to map to other implementations
%%
get_data(Q) -> 
	execute(Q).

%%
%% Facade pattern applied to map to other implementations
%%
set_data(Q) -> 
	execute(Q).


%%
%% Local Functions
%%

execute(Q) ->
    F = fun() -> qlc:e(Q) end,
	{atomic, Value} = mnesia:transaction(F),
	Value.

