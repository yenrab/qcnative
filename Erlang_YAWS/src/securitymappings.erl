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
%%
-module(securitymappings).

%%
%% Include files
%%

%%
%% Exported Functions
%%
-export([create_security_map/0]).
%%
%% Module scoped values
%%


%%
%% API Functions
%%

%%
%%  Any mappings created with the key "default" will be called on all requests.
%% 
           
create_security_map() ->
    Orig_map = dict:new(),
    Map1 = utilities:map_security("default", securityfunctions, check_command, Orig_map),

    %% Add any security mappings you wish to include in the application in this file.
	%% Your first mapping must have as input 'Map'.  The usrCnt example below is a mapping
    %% similar to ones you will be adding.  Make sure to update the final mapping, login in
    %% this case.  The order of the mappings in the file for each key value, such as "userCnt"
    %% is the order in which they will be called for that key.  If you desire a specific order 
    %% for your security checks it would be wise to group all mappings for that key together.
    %% Remember, there is no data passing between security functions.
    
    Map2 = utilities:map_security("userCnt", securityfunctions, check_logged_in, Map1),

	utilities:map_security("login", securityfunctions, validate_uname_pword, Map2).    
      
           
           
