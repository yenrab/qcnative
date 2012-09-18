//
//  WebLoadListener.h
//  QC_WAIT Example
//
//  Created by Lee Barney on 9/18/12.
//  Copyright (c) 2012 Lee Barney. All rights reserved.
//

#import <Foundation/Foundation.h>

@class QCRequestHandler;

@interface WebLoadListener : NSObject <UIWebViewDelegate>
@property (strong, nonatomic) QCRequestHandler *theHandler;

-(WebLoadListener*) initWithRequestHandler:(QCRequestHandler*)aHandler;


@end
